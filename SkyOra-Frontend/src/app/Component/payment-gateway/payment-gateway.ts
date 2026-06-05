import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../services/booking';
import { BookingFlowService } from '../../services/booking-flow';
import { MenuCartService } from '../../services/menu-cart.service';

type PaymentMethodId = 'card' | 'upi' | 'netBanking' | 'wallet';

interface PaymentMethod {
  id: PaymentMethodId;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
}

interface PaymentNavigationState {
  checkoutType?: 'booking' | 'menu';
  amount?: number;
  summary?: {
    subtotal?: number;
    deliveryFee?: number;
    discount?: number;
    totalPayable?: number;
  };
}

@Component({
  selector: 'app-payment-gateway',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment-gateway.html',
  styleUrl: './payment-gateway.css',
})
export class PaymentGateway {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);
  private readonly bookingFlowService = inject(BookingFlowService);
  private readonly menuCartService = inject(MenuCartService);
  private readonly navigationState = (typeof history !== 'undefined'
    ? (history.state as PaymentNavigationState | undefined)
    : undefined);

  readonly paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      title: 'Card',
      subtitle: 'Visa, Mastercard, RuPay',
      description: 'Pay instantly with debit or credit cards.',
      accent: 'card'
    },
    {
      id: 'upi',
      title: 'UPI',
      subtitle: 'Google Pay, PhonePe, Paytm',
      description: 'Use any UPI app with a secure collect request or UPI ID.',
      accent: 'upi'
    },
    {
      id: 'netBanking',
      title: 'Net Banking',
      subtitle: 'All major banks supported',
      description: 'Choose your bank and complete the payment on the bank portal.',
      accent: 'banking'
    },
    {
      id: 'wallet',
      title: 'Wallets',
      subtitle: 'Amazon Pay, Paytm Wallet, Mobikwik',
      description: 'Fast checkout with popular digital wallets.',
      accent: 'wallet'
    }
  ];

  readonly selectedMethod = signal<PaymentMethodId>('card');
  readonly isProcessing = signal(false);
  readonly paymentSuccess = signal(false);
  readonly paymentError = signal('');
  readonly checkoutType = signal<'booking' | 'menu'>('booking');
  readonly pendingBooking = this.bookingFlowService.pendingBooking;

  readonly pageTitle = computed(() => this.checkoutType() === 'menu' ? 'Food Payment' : 'Payment Gateway');
  readonly pageDescription = computed(() => this.checkoutType() === 'menu'
    ? 'Confirm your food order and complete payment to enjoy your meal at the lounge.'
    : 'Choose your preferred payment method and complete your booking in a few steps.');
  readonly successMessage = computed(() => this.checkoutType() === 'menu'
    ? 'Payment done. Enjoy your food at the lounge.'
    : 'Payment successful. Your booking is being confirmed.');

  readonly paymentForm = this.fb.group({
    amount: [2499, [Validators.required, Validators.min(1)]],
    cardName: [''],
    cardNumber: [''],
    expiryMonth: [''],
    expiryYear: [''],
    cvv: [''],
    upiId: [''],
    bankName: [''],
    walletName: ['']
  });

  readonly activeMethod = computed(
    () => this.paymentMethods.find((method) => method.id === this.selectedMethod()) ?? this.paymentMethods[0]
  );

  constructor() {
    const navigationState = (this.router.getCurrentNavigation()?.extras.state ?? this.navigationState) as PaymentNavigationState | undefined;
    const pending = this.bookingFlowService.getPendingBooking();

    if (navigationState?.checkoutType === 'menu') {
      this.checkoutType.set('menu');
      this.paymentForm.patchValue({ amount: navigationState.amount || 0 });
      this.applyMethodValidators(this.selectedMethod());
      return;
    }

    if (!pending) {
      this.safeAlert('No pending booking found. Please complete booking details first.');
      this.router.navigate(['/bookflight']);
      return;
    }

    this.paymentForm.patchValue({ amount: pending.TotalAmount || 0 });
    this.applyMethodValidators(this.selectedMethod());
  }

  selectMethod(methodId: PaymentMethodId): void {
    if (this.selectedMethod() === methodId) {
      return;
    }

    this.selectedMethod.set(methodId);
    this.paymentError.set('');
    this.paymentSuccess.set(false);
    this.applyMethodValidators(methodId);
  }

  submitPayment(): void {
    if (this.checkoutType() === 'menu') {
      this.submitMenuPayment();
      return;
    }

    const pending = this.bookingFlowService.getPendingBooking();

    if (!pending) {
      this.paymentError.set('Booking data not found. Please restart your booking.');
      this.router.navigate(['/bookflight']);
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.paymentError.set('Please complete the highlighted fields before continuing.');
      return;
    }

    this.isProcessing.set(true);
    this.paymentError.set('');
    this.paymentSuccess.set(false);

    const enteredAmount = Number(this.paymentForm.controls.amount.value || 0);
    this.bookingFlowService.updatePendingAmount(enteredAmount);

    const bookingPayload = this.bookingFlowService.getPendingBooking();

    if (!bookingPayload) {
      this.isProcessing.set(false);
      this.paymentError.set('Booking data not found. Please restart your booking.');
      this.router.navigate(['/bookflight']);
      return;
    }

    setTimeout(() => {
      const confirmedBookingPayload = {
        ...bookingPayload,
        BookingStatus: 'Confirmed',
        NumberOfPassengers: bookingPayload.Passengers.length
      };

      this.bookingService.createBooking(confirmedBookingPayload).subscribe({
        next: (savedBooking: any) => {
          this.isProcessing.set(false);
          this.paymentSuccess.set(true);
          this.paymentForm.reset({ amount: enteredAmount });
          this.applyMethodValidators(this.selectedMethod());

          // Persist the booking with backend-assigned BookingId
          const enhancedBooking = { ...confirmedBookingPayload, BookingId: savedBooking?.BookingId };
          this.bookingFlowService.setLastConfirmedBooking(enhancedBooking);
          this.bookingFlowService.clearPendingBooking();

          // Attempt to email ticket via backend and notify the user if it fails.
          if (savedBooking?.BookingId) {
            this.bookingService.sendTicket(savedBooking.BookingId).subscribe({
              next: () => console.log('Ticket email request sent.'),
              error: (e) => {
                console.warn('Ticket email failed:', e);
                this.safeAlert('Payment succeeded, but sending the ticket email failed. Please contact support or check your email settings.');
              }
            });
          }

          this.safeAlert('Payment successful and booking confirmed!');
          this.router.navigate(['/payment-success']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Booking confirmation failed after payment:', error);
          this.isProcessing.set(false);
          this.paymentError.set(this.getValidationErrorMessage(error));
        }
      });
    }, 1600);
  }

  private submitMenuPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.paymentError.set('Please complete the highlighted fields before continuing.');
      return;
    }

    this.isProcessing.set(true);
    this.paymentError.set('');
    this.paymentSuccess.set(false);

    const enteredAmount = Number(this.paymentForm.controls.amount.value || 0);

    setTimeout(() => {
      this.isProcessing.set(false);
      this.paymentSuccess.set(true);
      this.menuCartService.clearCart();
      this.router.navigate(['/payment-success'], {
        state: {
          checkoutType: 'menu',
          amount: enteredAmount
        }
      });
    }, 1200);
  }

  private getValidationErrorMessage(error: HttpErrorResponse): string {
    const errorBag = error.error?.errors as Record<string, string[]> | undefined;

    if (errorBag && typeof errorBag === 'object') {
      const details = Object.entries(errorBag)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join(' | ');

      if (details) {
        return `Booking confirmation failed: ${details}`;
      }
    }

    return 'Payment completed but booking confirmation failed. Please verify booking details and try again.';
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

  private applyMethodValidators(methodId: PaymentMethodId): void {
    const amountControl = this.paymentForm.controls.amount;
    const cardNameControl = this.paymentForm.controls.cardName;
    const cardNumberControl = this.paymentForm.controls.cardNumber;
    const expiryMonthControl = this.paymentForm.controls.expiryMonth;
    const expiryYearControl = this.paymentForm.controls.expiryYear;
    const cvvControl = this.paymentForm.controls.cvv;
    const upiIdControl = this.paymentForm.controls.upiId;
    const bankNameControl = this.paymentForm.controls.bankName;
    const walletNameControl = this.paymentForm.controls.walletName;

    cardNameControl.clearValidators();
    cardNumberControl.clearValidators();
    expiryMonthControl.clearValidators();
    expiryYearControl.clearValidators();
    cvvControl.clearValidators();
    upiIdControl.clearValidators();
    bankNameControl.clearValidators();
    walletNameControl.clearValidators();

    if (methodId === 'card') {
      cardNameControl.setValidators([Validators.required, Validators.minLength(3)]);
      cardNumberControl.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
      expiryMonthControl.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')]);
      expiryYearControl.setValidators([Validators.required, Validators.pattern('^[0-9]{2}$')]);
      cvvControl.setValidators([Validators.required, Validators.pattern('^[0-9]{3,4}$')]);
    }

    if (methodId === 'upi') {
      upiIdControl.setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9._-]+@[A-Za-z]+$')]);
    }

    if (methodId === 'netBanking') {
      bankNameControl.setValidators([Validators.required]);
    }

    if (methodId === 'wallet') {
      walletNameControl.setValidators([Validators.required]);
    }

    amountControl.setValidators([Validators.required, Validators.min(1)]);

    [
      cardNameControl,
      cardNumberControl,
      expiryMonthControl,
      expiryYearControl,
      cvvControl,
      upiIdControl,
      bankNameControl,
      walletNameControl,
      amountControl
    ].forEach((control) => control.updateValueAndValidity({ emitEvent: false }));
  }
}

