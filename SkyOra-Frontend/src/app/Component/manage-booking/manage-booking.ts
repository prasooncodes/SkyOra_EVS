import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking';
import { AuthService } from '../../services/auth-service';

interface BookingSummary {
  BookingId?: number;
  bookingId?: number;
  UserId?: number;
  Flight?: {
    FlightNo?: string;
    Source?: string;
    Destination?: string;
    DepartureTime?: string | Date;
  };
  NumberOfPassengers?: number;
  BookingStatus?: string;
  Passengers?: Array<{
    PassengerId?: number;
    Name?: string;
    SeatNumber?: string;
    SeatType?: string;
  }>;
  TotalAmount?: number;
}

@Component({
  selector: 'app-manage-booking',
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-booking.html',
  styleUrl: './manage-booking.css',
})
export class ManageBooking implements OnInit {
  bookings: BookingSummary[] = [];
  currentUserId: number = 0;
  private router = inject(Router);

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        // Filter bookings to show only current user's bookings
        this.bookings = data.filter((booking: BookingSummary) => booking.UserId === this.currentUserId);
        console.log("Current User ID:", this.currentUserId);
        console.log("User's bookings fetched successfully:", this.bookings);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error fetching bookings:", error);
      }
    });
  }

  onDeleteBooking(id: number): void {
    if (!id) {
      alert('Invalid booking selected for cancellation.');
      return;
    }

    this.router.navigate(['/cancel-booking', id]);
  }

  getBookingId(booking: BookingSummary): number {
    return Number(booking.BookingId ?? booking.bookingId ?? 0);
  }

  onEditBooking(id: number): void {
    if (!id) {
      alert('Invalid booking selected for editing.');
      return;
    }
    this.router.navigate(['/edit-booking', id]);
  }
}
