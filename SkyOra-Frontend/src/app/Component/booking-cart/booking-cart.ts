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

  // Coupon state
  originalTotal = 0;
  appliedCoupon: string | null = null;
  discountAmount = 0;

  // Simple in-component coupon definitions (code -> percent or flat)
  private coupons: Record<string, { type: 'percent' | 'flat'; value: number }> = {
    
    TRAVEL25: { type: 'percent', value: 25 },
    EARLY18: { type: 'percent', value: 18 },
    SUMMER20: { type: 'percent', value: 20 },
    BIZ15: { type: 'percent', value: 15 },
    STUDENT25: { type: 'percent', value: 25 },
    HDFCFEST: { type: 'percent', value: 10 },
    SBISAVE10: { type: 'percent', value: 10 },
    ICICI12: { type: 'percent', value: 12 }
  };

  constructor() {
    if (!this.pendingBooking()) {
      this.safeAlert('No pending booking found. Please select a flight first.');
      this.router.navigate(['/bookflight']);
    }
    const pb = this.pendingBooking();
    if (pb) {
      this.originalTotal = pb.TotalAmount;
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

  applyCoupon(code: string): void {
    if (!code) {
      this.safeAlert('Please enter a coupon code.');
      return;
    }

    const normalized = code.trim().toUpperCase();
    const coupon = this.coupons[normalized];
    if (!coupon) {
      this.safeAlert('Invalid coupon code.');
      return;
    }

    const base = this.originalTotal || this.pendingBooking()?.TotalAmount || 0;
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.round((base * coupon.value) / 100);
    } else {
      discount = Math.min(base, coupon.value);
    }

    const newTotal = Math.max(0, base - discount);
    this.bookingFlowService.updatePendingAmount(newTotal);
    this.appliedCoupon = normalized;
    this.discountAmount = discount;
  }

  removeCoupon(): void {
    // revert to original total
    this.bookingFlowService.updatePendingAmount(this.originalTotal || 0);
    this.appliedCoupon = null;
    this.discountAmount = 0;
  }
}