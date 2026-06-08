
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookingService } from '../../services/booking';

interface BookingCancellationDetails {
  BookingId?: number;
  bookingId?: number;
  BookingDate?: string;
  ReturnDate?: string;
  TotalAmount?: number;
  BookingStatus?: string;
  Flight?: {
    FlightNo?: string;
    Source?: string;
    Destination?: string;
    DepartureTime?: string | Date;
  };
}

@Component({
  selector: 'app-cancel-booking',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cancel-booking.html',
  styleUrl: './cancel-booking.css',
})
export class CancelBooking {
  private readonly bookingService = inject(BookingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly isCalculating = signal(false);
  readonly isCancelling = signal(false);
  readonly loadError = signal('');
  readonly refundCalculated = signal(false);
  readonly refundPercentage = signal(0);
  readonly refundAmount = signal(0);
  readonly daysUntilDeparture = signal<number | null>(null);
  readonly booking = signal<BookingCancellationDetails | null>(null);

  readonly bookingId = Number(this.route.snapshot.paramMap.get('id'));
  readonly totalAmount = computed(() => Number(this.booking()?.TotalAmount || 0));
  readonly bookingReference = computed(() => this.booking()?.BookingId || this.bookingId || 0);

  constructor() {
    if (!this.bookingId) {
      this.loadError.set('Invalid booking id.');
      this.isLoading.set(false);
      return;
    }

    this.loadBooking(this.bookingId);
  }

  calculateRefund(): void {
    this.isCalculating.set(true);
    const booking = this.booking();

    if (!booking) {
      this.loadError.set('Booking details are not available.');
      this.isCalculating.set(false);
      return;
    }

    const departureDate = this.parseBookingDate(
      booking.Flight?.DepartureTime || booking.ReturnDate || booking.BookingDate
    );

    if (!departureDate) {
      this.loadError.set('Unable to determine the departure date for this booking.');
      this.isCalculating.set(false);
      return;
    }

    const today = this.startOfDay(new Date());
    const departure = this.startOfDay(departureDate);
    const daysLeft = Math.max(0, Math.ceil((departure.getTime() - today.getTime()) / this.dayInMs));
    const refundPercentage = daysLeft >= 7 ? 0.5 : daysLeft >= 3 ? 0.25 : 0;
    const refundAmount = Math.round(this.totalAmount() * refundPercentage * 100) / 100;

    this.daysUntilDeparture.set(daysLeft);
    this.refundPercentage.set(refundPercentage);
    this.refundAmount.set(refundAmount);
    this.refundCalculated.set(true);
    this.isCalculating.set(false);
  }

  confirmCancelBooking(): void {
    if (!this.bookingId || this.isCancelling()) {
      return;
    }

    this.isCancelling.set(true);
    this.bookingService.deleteBooking(this.bookingId).subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.safeAlert(
          `Booking cancelled successfully. Refund of ₹${this.refundAmount().toFixed(0)} will be processed in 2-3 working days.`
        );
        this.router.navigate(['/manage-bookings']);
      },
      error: () => {
        this.isCancelling.set(false);
        this.safeAlert('Failed to cancel booking. Please try again.');
      },
    });
  }

  private loadBooking(id: number): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.bookingService.getBookingById(id).pipe(takeUntilDestroyed()).subscribe({
      next: (booking: BookingCancellationDetails) => {
        this.booking.set(booking);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('Unable to load booking details. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  private parseBookingDate(value: string | Date | undefined): Date | null {
    if (!value) {
      return null;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private safeAlert(message: string): void {
    try {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(message);
      }
    } catch {
      // Ignore alert failures in non-browser contexts.
    }
  }

  private readonly dayInMs = 1000 * 60 * 60 * 24;
}
