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
  searchedFlights: FlightInterface[] = [];
  isSearching: boolean = false;

  // Passenger interface
  passengers: Array<{
    name: string;
    age: number | null;
    gender: string;
    seatType: string;
  }> = [];

  // Indian cities list
  indianCities: string[] = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore',
    'Kochi', 'Visakhapatnam', 'Surat', 'Vadodara', 'Nagpur', 'Bhopal',
    'Guwahati', 'Cochin', 'Thiruvananthapuram', 'Calicut', 'Coimbatore',
    'Madurai', 'Varanasi', 'Patna', 'Ranchi', 'Srinagar', 'Jodhpur',
    'Udaipur', 'Goa', 'Agra', 'Amritsar', 'Ludhiana', 'Kanpur',
    'Aurangabad', 'Nashik'
  ];

  searchCriteria = {
    source: '',
    destination: ''
  };

  bookingData = {
    flightId: 0,
    userId: 0,
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
    
    // Initialize passengers array
    this.updatePassengersArray(1);

    if (this.flightId) {
      this.bookingData.flightId = this.flightId;
      this.loadFlightById(this.flightId);
    }
  }

  updatePassengersArray(count: number): void {
    const currentLength = this.passengers.length;
    
    if (count > currentLength) {
      // Add new passenger entries
      for (let i = currentLength; i < count; i++) {
        this.passengers.push({
          name: '',
          age: null,
          gender: '',
          seatType: 'Economy'
        });
      }
    } else if (count < currentLength) {
      // Remove extra passenger entries
      this.passengers = this.passengers.slice(0, count);
    }
    this.bookingData.numberOfPassengers = count;
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

    const flightId = id;
    const matchedFlight = this.searchedFlights.find(f => (f.FlightId || f.flightId) === flightId);
    if (matchedFlight) {
      this.flight = matchedFlight;
    } else {
      this.loadFlightById(id);
    }

    this.bookingData.flightId = id;
  }

  searchFlights(): void {
    if (!this.searchCriteria.source || !this.searchCriteria.destination) {
      alert('Please select both source and destination cities.');
      return;
    }

    if (this.searchCriteria.source === this.searchCriteria.destination) {
      alert('Source and destination cities must be different.');
      return;
    }

    this.isSearching = true;
    this.flightService.searchFlights(this.searchCriteria.source, this.searchCriteria.destination).subscribe({
      next: (data) => {
        this.searchedFlights = data;
        if (this.searchedFlights.length === 0) {
          alert('No flights found for the selected route.');
        } else if (this.searchedFlights.length === 1) {
          const flightId = this.searchedFlights[0].FlightId || this.searchedFlights[0].flightId || 0;
          this.selectFlightById(flightId);
        }
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Flight search failed:', error);
        alert('Unable to search flights. Please try again later.');
        this.isSearching = false;
      }
    });
  }

  getTicketPrice(): number {
    if (!this.flight) {
      return 0;
    }
    // Calculate total price for all passengers based on their seat types
    let totalPrice = 0;
    for (let i = 0; i < this.passengers.length; i++) {
      const passengerSeatType = this.passengers[i].seatType;
      const price = passengerSeatType === 'Economy'
        ? Number(this.flight.EconomyPrice || this.flight.economyPrice || 0)
        : Number(this.flight.BusinessPrice || this.flight.businessPrice || 0);
      totalPrice += price;
    }
    return totalPrice;
  }

  get totalPrice(): number {
    return this.getTicketPrice();
  }

  isAllPassengersValid(): boolean {
    return this.passengers.every(p => p.name && p.age && p.age > 0);
  }

  processBooking(): void {
    if (!this.flight) {
      alert('Please select a flight before confirming booking.');
      return;
    }

    if (!this.isAllPassengersValid()) {
      alert('Please fill in all passenger details (name, age, and seat type).');
      return;
    }

    const bookingPayload = {
      UserId: this.bookingData.userId,
      FlightId: this.bookingData.flightId,
      NumberOfPassengers: this.bookingData.numberOfPassengers,
      TotalAmount: this.totalPrice,
      BookingStatus: this.bookingData.status,
      Passengers: this.passengers.map(p => ({
        PassengerName: p.name,
        PassengerAge: p.age,
        PassengerGender:p.gender,
        SeatType: p.seatType
      }))
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
