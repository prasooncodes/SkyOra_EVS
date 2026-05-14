import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingFlowService } from '../../services/booking-flow';

@Component({
  selector: 'app-booking-cart',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-cart.html',
  styleUrl: './booking-cart.css'
})
export class BookingCart {
  private readonly bookingFlowService = inject(BookingFlowService);
  private readonly router = inject(Router);

  readonly pendingBooking = this.bookingFlowService.pendingBooking;
  readonly hasPendingBooking = computed(() => this.pendingBooking() !== null);

  constructor() {
    if (!this.pendingBooking()) {
      this.safeAlert('No pending booking found. Please select a flight first.');
      this.router.navigate(['/bookflight']);
    }
  }

  goToPayment(): void {
    this.router.navigate(['/payment']);
  }

  backToBookFlight(): void {
    this.router.navigate(['/bookflight']);
  }

  private safeAlert(message: string): void {
    try {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(message);
      } else {
        console.warn('Alert:', message);
      }
    } catch (error) {
      console.warn('safeAlert failed', error, message);
    }
  }
}