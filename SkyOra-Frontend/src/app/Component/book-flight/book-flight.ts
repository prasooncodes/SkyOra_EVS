import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../services/flight';
import { BookingService } from '../../services/booking';
import { FlightInterface } from '../../Models/flights';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-flight.html',
  styleUrls: ['./book-flight.css'],
})
export class BookFlight implements OnInit {
  flightId: number = 0;
  flight: FlightInterface | null = null;
  flights: FlightInterface[] = [];

  bookingData = {
    flightId: 0,
    userId: 0,
    passengerName: '',
    passengerAge: null as number | null,
    seatType: 'Economy',
    numberOfPassengers: 1,
    bookingDate: new Date(),
    status: 'Confirmed'
  };

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
    private ar: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUserId = this.authService.getUserId();

    if (currentUserId === 0) {
      alert('Please log in to book a flight.');
      this.router.navigate(['/login']);
      return;
    }

    this.bookingData.userId = currentUserId;
    this.flightId = Number(this.ar.snapshot.paramMap.get('id')) || 0;

    if (this.flightId) {
      this.bookingData.flightId = this.flightId;
      this.loadFlightById(this.flightId);
    } else {
      this.loadFlights();
    }
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
        if (!this.bookingData.flightId && this.flights.length) {
          this.bookingData.flightId = this.flights[0].FlightId ?? this.flights[0].flightId;
        }
        if (this.bookingData.flightId) {
          this.selectFlightById(this.bookingData.flightId);
        }
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Unable to load flights:', error)
    });
  }

  loadFlightById(id: number): void {
    this.flightService.getFlightById(id).subscribe({
      next: (data) => {
        this.flight = data;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading flight:', error)
    });
  }

  selectFlightById(id: number): void {
    if (!id) {
      this.flight = null;
      return;
    }

    const matchedFlight = this.flights.find(f => f.FlightId === id || f.flightId === id);
    if (matchedFlight) {
      this.flight = matchedFlight;
    } else {
      this.loadFlightById(id);
    }

    this.bookingData.flightId = id;
  }

  getTicketPrice(): number {
    if (!this.flight) {
      return 0;
    }
    return this.bookingData.seatType === 'Economy'
      ? Number(this.flight.EconomyPrice ?? this.flight.economyPrice ?? 0)
      : Number(this.flight.BusinessPrice ?? this.flight.businessPrice ?? 0);
  }

  get totalPrice(): number {
    return this.getTicketPrice() * (this.bookingData.numberOfPassengers || 1);
  }

  processBooking() {
    if (!this.flight) {
      alert('Please select a flight before confirming booking.');
      return;
    }

    if (!this.bookingData.passengerName || !this.bookingData.passengerAge) {
      alert('Please enter passenger name and age before confirming booking.');
      return;
    }

    const bookingPayload = {
      UserId: this.bookingData.userId,
      FlightId: this.bookingData.flightId,
      NumberOfPassengers: this.bookingData.numberOfPassengers,
      TotalAmount: this.totalPrice,
      BookingStatus: this.bookingData.status
    };

    this.bookingService.createBooking(bookingPayload).subscribe({
      next: () => {
        alert('Booking confirmed successfully!');
        this.router.navigate(['/bookings']);
      },
      error: (error) => {
        console.error('Booking failed:', error);
        alert('Unable to confirm booking. Please try again later.');
      }
    });
  }
}
