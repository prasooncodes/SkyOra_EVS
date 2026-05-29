import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight';
import { FlightInterface } from '../../Models/flights';
import { AuthService } from '../../services/auth-service';
import { BookingFlowService } from '../../services/booking-flow';
import { BookingService } from '../../services/booking';
import { GoogleAnalyticsService } from '../../services/google-analytics';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    bookingDate: '',
    returnDate: '',
    status: 'Confirmed',
    tripType: 'oneway',
    agreedToTerms: false
  };

  // Minimum selectable booking date (YYYY-MM-DD) - cannot be before today
  minBookingDate: string = '';

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private bookingFlowService: BookingFlowService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
    private ar: ActivatedRoute,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  // Use this instead of calling `alert()` directly so SSR won't crash
  safeAlert(message: string): void {
    try {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(message);
      } else {
        // fallback for server-side rendering
        // eslint-disable-next-line no-console
        console.warn('Alert:', message);
      }
    } catch (e) {
      // swallow any errors in environments without window
      // eslint-disable-next-line no-console
      console.warn('safeAlert failed', e, message);
    }
  }

  ngOnInit(): void {
    // Track page view
    this.googleAnalyticsService.trackPageView('Book Flight', '/book-flight');

    const currentUserId = this.authService.getUserId();

    if (currentUserId === 0) {
      this.safeAlert('Please log in to book a flight.');
      this.router.navigate(['/login']);
      return;
    }

    this.bookingData.userId = currentUserId;
    this.flightId = Number(this.ar.snapshot.paramMap.get('id')) || 0;
    
    // Initialize passengers array
    this.updatePassengersArray(1);

    // set minimum booking date to today and default booking date to today
    this.minBookingDate = this.formatDateToYYYYMMDD(new Date());
    this.bookingData.bookingDate = this.minBookingDate;

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
    
    // Track passenger count change
    this.googleAnalyticsService.trackPassengerCountChange(count);
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

    // Track flight selection
    this.googleAnalyticsService.trackFlightSelection(
      id,
      this.searchCriteria.source,
      this.searchCriteria.destination
    );
  }

  searchFlights(): void {
    if (!this.searchCriteria.source || !this.searchCriteria.destination) {
      this.safeAlert('Please select both source and destination cities.');
      this.googleAnalyticsService.trackValidationError('Missing source or destination city');
      return;
    }

    if (this.searchCriteria.source === this.searchCriteria.destination) {
      this.safeAlert('Source and destination cities must be different.');
      this.googleAnalyticsService.trackValidationError('Source and destination cities are same');
      return;
    }

    // Track flight search
    this.googleAnalyticsService.trackFlightSearch(
      this.searchCriteria.source,
      this.searchCriteria.destination,
      this.bookingData.tripType
    );

    this.isSearching = true;
    this.flightService.searchFlights(this.searchCriteria.source, this.searchCriteria.destination).subscribe({
      next: (data) => {
        this.searchedFlights = data;
        if (this.searchedFlights.length === 0) {
            this.safeAlert('No flights found for the selected route.');
            this.googleAnalyticsService.trackEvent('flight_search_no_results', {
              source_city: this.searchCriteria.source,
              destination_city: this.searchCriteria.destination
            });
        } else if (this.searchedFlights.length === 1) {
          const flightId = this.searchedFlights[0].FlightId || this.searchedFlights[0].flightId || 0;
          this.selectFlightById(flightId);
        }
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Flight search failed:', error);
        this.safeAlert('Unable to search flights. Please try again later.');
        this.googleAnalyticsService.trackError('flight_search_error', error?.message || 'Unknown error');
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
    // If round-trip, assume return fare equals outbound fare
    if (this.bookingData.tripType === 'roundtrip') {
      totalPrice = totalPrice * 2;
    }
    return totalPrice;
  }

  get totalPrice(): number {
    return this.getTicketPrice();
  }

  isAllPassengersValid(): boolean {
    return this.passengers.every(
      (p) =>
        !!p.name?.trim() &&
        !!p.gender?.trim() &&
        !!p.seatType?.trim() &&
        typeof p.age === 'number' &&
        p.age > 0
    );
  }

  // Format a Date to YYYY-MM-DD for use with input[type="date"] and min attr
  formatDateToYYYYMMDD(d: Date): string {
    const yr = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${yr}-${m}-${day}`;
  }

  // Ensure booking date string is not before today
  isBookingDateValid(dateStr: string): boolean {
    if (!dateStr) return false;
    const selected = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    // zero out time for today
    today.setHours(0,0,0,0);
    return selected.getTime() >= today.getTime();
  }

  isReturnDateValid(dateStr: string): boolean {
    if (this.bookingData.tripType !== 'roundtrip') {
      return true;
    }

    if (!dateStr || !this.isBookingDateValid(this.bookingData.bookingDate)) {
      return false;
    }

    const returnDate = new Date(dateStr + 'T00:00:00');
    const bookingDate = new Date(this.bookingData.bookingDate + 'T00:00:00');
    return returnDate.getTime() >= bookingDate.getTime();
  }

  processBooking(): void {
    if (!this.flight) {
      this.safeAlert('Please select a flight before confirming booking.');
      this.googleAnalyticsService.trackValidationError('No flight selected');
      return;
    }

    if (!this.isAllPassengersValid()) {
      this.safeAlert('Please fill in all passenger details (name, age, gender, and seat type).');
      this.googleAnalyticsService.trackValidationError('Invalid passenger details');
      return;
    }

    // Validate booking date
    if (!this.bookingData.bookingDate || !this.isBookingDateValid(this.bookingData.bookingDate)) {
      this.safeAlert('Please choose a valid booking date. Date cannot be earlier than today.');
      this.googleAnalyticsService.trackValidationError('Invalid booking date');
      return;
    }

    if (this.bookingData.tripType === 'roundtrip' && !this.isReturnDateValid(this.bookingData.returnDate)) {
      this.safeAlert('Please choose a valid return date. It cannot be earlier than the booking date.');
      this.googleAnalyticsService.trackValidationError('Invalid return date');
      return;
    }

    // Track booking initiated
    this.googleAnalyticsService.trackBookingInitiated(
      this.totalPrice,
      this.passengers.length,
      this.bookingData.flightId
    );

    const bookingPayload = {
      UserId: this.bookingData.userId,
      FlightId: this.bookingData.flightId,
      NumberOfPassengers: this.passengers.length,
      TotalAmount: this.totalPrice,
      BookingStatus: 'Pending',
      TripType: this.bookingData.tripType,
      BookingDate: this.bookingData.bookingDate,
      ReturnDate: this.bookingData.tripType === 'roundtrip' ? this.bookingData.returnDate : this.bookingData.bookingDate,
      Passengers: this.passengers.map(p => ({
        Name: p.name.trim(),
        Age: Number(p.age),
        Gender: p.gender.trim(),
        SeatType: p.seatType // ✅ Include passengers with booking
      }))
    };
    this.bookingFlowService.setPendingBooking(bookingPayload);

    // Track booking completed
    this.googleAnalyticsService.trackBookingCompleted(
      this.totalPrice,
      this.passengers.length,
      this.bookingData.flightId
    );

    this.router.navigate(['/booking-cart']); 
  }

    /**
     * Track trip type change
     */
    onTripTypeChange(tripType: string): void {
      this.bookingData.tripType = tripType;
      this.googleAnalyticsService.trackTripTypeSelection(tripType);
    }

    /**
     * Track booking date change
     */
    onBookingDateChange(date: string): void {
      this.bookingData.bookingDate = date;
      this.googleAnalyticsService.trackDateSelection('booking_date', date);
    }

    /**
     * Track return date change
     */
    onReturnDateChange(date: string): void {
      this.bookingData.returnDate = date;
      this.googleAnalyticsService.trackDateSelection('return_date', date);
    }

    /**
     * Track seat type change for a passenger
     */
    onSeatTypeChange(seatType: string, passengerIndex: number): void {
      if (this.passengers[passengerIndex]) {
        this.passengers[passengerIndex].seatType = seatType;
        this.googleAnalyticsService.trackSeatTypeSelection(seatType, passengerIndex);
      }
    }
}
