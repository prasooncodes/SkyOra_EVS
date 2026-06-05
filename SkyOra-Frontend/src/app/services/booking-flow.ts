import { Injectable, signal } from '@angular/core';
import { FlightInterface } from '../Models/flights';

export interface PendingPassenger {
  Name: string;
  Age: number;
  Gender: string;
  SeatType: string;
  SeatNumber?: string;
}

export interface PendingBookingPayload {
  BookingId?: number;
  UserId: number;
  FlightId: number;
  ReturnFlightId?: number;
  NumberOfPassengers: number;
  TotalAmount: number;
  BookingStatus: string;
  TripType: string;
  BookingDate: string;
  ReturnDate: string;
  Passengers: PendingPassenger[];
  OutboundFlight?: FlightInterface | null;
  ReturnFlight?: FlightInterface | null;
}

@Injectable({
  providedIn: 'root'
})
export class BookingFlowService {
  private readonly pendingBookingState = signal<PendingBookingPayload | null>(null);

  readonly pendingBooking = this.pendingBookingState.asReadonly();

  private readonly lastConfirmedBookingState = signal<PendingBookingPayload | null>(null);
  readonly lastConfirmedBooking = this.lastConfirmedBookingState.asReadonly();

  setPendingBooking(payload: PendingBookingPayload): void {
    this.pendingBookingState.set({
      ...payload,
      OutboundFlight: payload.OutboundFlight ? { ...payload.OutboundFlight } : null,
      ReturnFlight: payload.ReturnFlight ? { ...payload.ReturnFlight } : null,
      NumberOfPassengers: payload.Passengers.length,
      Passengers: payload.Passengers.map((passenger) => ({ ...passenger }))
    });
  }

  setLastConfirmedBooking(payload: PendingBookingPayload): void {
    this.lastConfirmedBookingState.set({
      ...payload,
      OutboundFlight: payload.OutboundFlight ? { ...payload.OutboundFlight } : null,
      ReturnFlight: payload.ReturnFlight ? { ...payload.ReturnFlight } : null,
      NumberOfPassengers: payload.Passengers.length,
      Passengers: payload.Passengers.map((passenger) => ({ ...passenger }))
    });
  }

  getPendingBooking(): PendingBookingPayload | null {
    return this.pendingBookingState();
  }

  getLastConfirmedBooking(): PendingBookingPayload | null {
    return this.lastConfirmedBookingState();
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