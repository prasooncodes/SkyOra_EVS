import { Injectable, signal } from '@angular/core';

export interface PendingPassenger {
  PassengerName: string;
  PassengerAge: number;
  PassengerGender: string;
  SeatType: string;
}

export interface PendingBookingPayload {
  UserId: number;
  FlightId: number;
  NumberOfPassengers: number;
  TotalAmount: number;
  BookingStatus: string;
  TripType: string;
  BookingDate: string;
  ReturnDate: string;
  Passengers: PendingPassenger[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingFlowService {
  private readonly pendingBookingState = signal<PendingBookingPayload | null>(null);

  readonly pendingBooking = this.pendingBookingState.asReadonly();

  setPendingBooking(payload: PendingBookingPayload): void {
    this.pendingBookingState.set({
      ...payload,
      NumberOfPassengers: payload.Passengers.length,
      Passengers: payload.Passengers.map((passenger) => ({ ...passenger }))
    });
  }

  getPendingBooking(): PendingBookingPayload | null {
    return this.pendingBookingState();
  }

  updatePendingAmount(amount: number): void {
    const pending = this.pendingBookingState();
    if (!pending) {
      return;
    }

    this.pendingBookingState.set({
      ...pending,
      TotalAmount: amount
    });
  }

  clearPendingBooking(): void {
    this.pendingBookingState.set(null);
  }
}