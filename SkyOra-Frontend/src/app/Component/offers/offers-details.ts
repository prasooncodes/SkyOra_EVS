import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface Coupon {
  icon: string;
  title: string;
  description: string;
  code: string;
}

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './offers-details.html',
  styleUrl: './offers-details.css',
})
export class OfferDetails implements OnInit {
  category = '';
  coupons: Coupon[] = [];
  copiedCode: string | null = null;
  showToast = false;

  private readonly categories: { [key: string]: Coupon[] } = {
    flights: [
      { icon: '✈️', title: 'Travel Sale', description: 'Save up to 25% on select flight routes with this coupon.', code: 'TRAVEL25' },
      { icon: '🛫', title: 'Early Bird', description: 'Book early and enjoy 18% off across all domestic flights.', code: 'EARLY18' },
      { icon: '🌍', title: 'Summer Escape', description: 'Get a flat 20% discount on summer bookings.', code: 'SUMMER20' },
      { icon: '💼', title: 'Business Boost', description: 'Premium fares at a sweet 15% savings.', code: 'BIZ15' }
    ],
    special: [
      { icon: '🌟', title: 'Student Fare', description: 'Extra baggage and savings for student travelers.', code: 'STUDENT25' },
      { icon: '🎉', title: 'Festival Deal', description: 'Exclusive festive discount for your next trip.', code: 'FEST20' },
      { icon: '🤝', title: 'Partner Offer', description: 'Special fares with partner airlines.', code: 'PARTNER15' }
    ],
    bank: [
      { icon: '💳', title: 'HDFC Bank', description: 'Flat 10% off when you pay with HDFC debit/credit cards.', code: 'HDFCFEST' },
      { icon: '🏦', title: 'SBI Saver', description: 'Enjoy extra savings using SBI cards.', code: 'SBISAVE10' },
      { icon: '🪙', title: 'ICICI Instant', description: 'Instant 12% off on ICICI transactions.', code: 'ICICI12' }
    ],
    hotel: [
      { icon: '🏨', title: 'Luxury Stay', description: 'Get 25% off on luxury hotel bookings.', code: 'STAY25' },
      { icon: '🛎️', title: 'Early Checkin', description: 'Save more on early hotel check-ins.', code: 'CHECKIN15' },
      { icon: '🍽️', title: 'Dining Treat', description: 'Complimentary dining credit with hotel booking.', code: 'DINE20' }
    ]
  };

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category')?.toLowerCase() ?? '';
      if (!category || !this.categories[category]) {
        this.router.navigate(['/offers']);
        return;
      }
      this.category = category;
      this.coupons = this.categories[category];
    });
  }

  get displayCategory(): string {
    return this.category === 'flights'
      ? 'Flight'
      : this.category === 'special'
      ? 'Special'
      : this.category === 'bank'
      ? 'Bank'
      : this.category === 'hotel'
      ? 'Hotel'
      : 'Offer';
  }

  copyCouponCode(code: string): void {
    const text = code.trim();
    if (!text) {
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.copiedCode = code;
          this.showToast = true;
          this.cdr.markForCheck();
          window.setTimeout(() => {
            this.copiedCode = null;
            this.showToast = false;
            this.cdr.markForCheck();
          }, 2000);
        })
        .catch(() => {
          this.copiedCode = code;
          this.showToast = true;
          this.cdr.markForCheck();
          window.setTimeout(() => {
            this.copiedCode = null;
            this.showToast = false;
            this.cdr.markForCheck();
          }, 2000);
        });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.copiedCode = code;
      this.showToast = true;
      this.cdr.markForCheck();
      window.setTimeout(() => {
        this.copiedCode = null;
        this.showToast = false;
        this.cdr.markForCheck();
      }, 2000);
    }
  }
}
