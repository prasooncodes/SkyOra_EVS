import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-booking',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-booking.html',
  styleUrl: './edit-booking.css',
})
export class EditBooking {
  private readonly bookingService = inject(BookingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly loadError = signal('');
  readonly optionsAmount = signal(0);

  bookingId = 0;
  baseAmount = 0;
  private loadedBooking: any = null;

  readonly editForm = this.fb.nonNullable.group({
    numberOfPassengers: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
    tripType: ['oneway', [Validators.required]],
    bookingDate: ['', [Validators.required]],
    returnDate: [''],
    bookingStatus: ['Pending', [Validators.required]],
    seatPreference: ['Window'],
    mealPreference: ['Vegetarian'],
    addInsurance: [false],
    priorityBoarding: [false],
    airportLounge: [false],
    agreedToTerms: [false, [Validators.requiredTrue]]
  });

  readonly revisedAmount = computed(() => this.baseAmount + this.optionsAmount());

  constructor() {
    this.editForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateOptionsAmount());

    this.editForm.controls.tripType.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((tripType) => this.handleTripTypeChange(tripType || 'oneway'));

    const routeId = Number(this.route.snapshot.paramMap.get('id'));
    if (!routeId) {
      this.loadError.set('Invalid booking id.');
      this.isLoading.set(false);
      return;
    }

    this.bookingId = routeId;
    this.updateOptionsAmount();
    this.loadBooking(routeId);
  }

  private handleTripTypeChange(tripType: string): void {
    const returnDateControl = this.editForm.controls.returnDate;

    if (tripType === 'roundtrip') {
      returnDateControl.addValidators([Validators.required]);
    } else {
      returnDateControl.clearValidators();
      returnDateControl.setValue('');
    }

    returnDateControl.updateValueAndValidity({ emitEvent: false });
  }

  private updateOptionsAmount(): void {
    const value = this.editForm.getRawValue();
    let extra = 0;
    if (value.addInsurance) {
      extra += 499;
    }
    if (value.priorityBoarding) {
      extra += 299;
    }
    if (value.airportLounge) {
      extra += 899;
    }
    this.optionsAmount.set(extra);
  }

  private loadBooking(id: number): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.bookingService.getBookingById(id).subscribe({
      next: (booking: any) => {
        this.loadedBooking = booking;
        this.baseAmount = Number(booking?.TotalAmount || 0);
        const currentTripType = (booking?.TripType || 'oneway').toLowerCase();

        this.editForm.patchValue({
          numberOfPassengers: Number(booking?.NumberOfPassengers || 1),
          tripType: currentTripType,
          bookingDate: (booking?.BookingDate || '').slice(0, 10),
          returnDate: (booking?.ReturnDate || '').slice(0, 10),
          bookingStatus: booking?.BookingStatus || 'Pending'
        });

        this.handleTripTypeChange(currentTripType);
        this.updateOptionsAmount();
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('Unable to load booking details. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  saveBooking(): void {
    if (this.editForm.invalid || this.isSaving()) {
      this.editForm.markAllAsTouched();
      return;
    }

    const form = this.editForm.getRawValue();
    const existing = this.loadedBooking || {};
    const normalizedTripType = form.tripType.toLowerCase();
    const normalizedReturnDate =
      normalizedTripType === 'roundtrip'
        ? (form.returnDate || form.bookingDate)
        : form.bookingDate;

    const payload = {
      ...existing,
      BookingId: existing?.BookingId ?? this.bookingId,
      UserId: existing?.UserId,
      FlightId: existing?.FlightId,
      NumberOfPassengers: Number(form.numberOfPassengers),
      TripType: normalizedTripType,
      BookingDate: form.bookingDate,
      ReturnDate: normalizedReturnDate,
      BookingStatus: form.bookingStatus,
      TotalAmount: this.revisedAmount(),
      Options: {
        SeatPreference: form.seatPreference,
        MealPreference: form.mealPreference,
        AddInsurance: form.addInsurance,
        PriorityBoarding: form.priorityBoarding,
        AirportLounge: form.airportLounge
      }
    };

    this.isSaving.set(true);
    this.bookingService.updateBooking(this.bookingId, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.safeAlert('Booking updated successfully.');
        this.router.navigate(['/manage-bookings']);
      },
      error: () => {
        this.isSaving.set(false);
        this.safeAlert('Failed to update booking. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/manage-bookings']);
  }

  private safeAlert(message: string): void {
    try {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(message);
      }
    } catch {
      // ignore alert failures in non-browser contexts
    }
  }
}
