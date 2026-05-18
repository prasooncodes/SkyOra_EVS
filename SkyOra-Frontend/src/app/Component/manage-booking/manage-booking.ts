import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-booking',
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-booking.html',
  styleUrl: './manage-booking.css',
})
export class ManageBooking implements OnInit {
  bookings: any[] = [CommonModule, RouterLink];
  currentUserId: number = 0;
  private router = inject(Router)

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

  onDeleteBooking(id: number): void {
    if (!id) {
      alert('Invalid booking selected for deletion.');
      return;
    }


    const isConfirmed = window.confirm('Are you sure you want to delete your booking?');


    if (!isConfirmed) {
      return;
    }

    // 3. If they click "OK", proceed with your original API request
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(
          (booking: any) => (booking.BookingId || booking.bookingId) !== id
        );
        alert('Booking deleted successfully.');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
      },
    });
  }

  onEditBooking(id: number): void {
    if (!id) {
      alert('Invalid booking selected for editing.');
      return;
    }
    this.router.navigate(['/edit-booking', id]);
  }
}
