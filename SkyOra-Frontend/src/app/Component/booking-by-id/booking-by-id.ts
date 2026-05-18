import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-by-id',
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-by-id.html',
  styleUrl: './booking-by-id.css',
})
export class BookingByID implements OnInit {
  bookings: any[] = [];
  currentUserId: number = 0;

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
        this.bookings = data.filter((booking: any) => booking.UserId === this.currentUserId);
        console.log("Current User ID:", this.currentUserId);
        console.log("User's bookings fetched successfully:", this.bookings);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error fetching bookings:", error);
      }
    });
  }
}
