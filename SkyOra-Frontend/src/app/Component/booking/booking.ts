import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true, 
  imports: [CommonModule, RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef) {} 

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        console.log("Bookings fetched successfully:", this.bookings);
        // ✅ Log flight details for debugging
        if (this.bookings.length > 0) {
          console.log("First booking details:", this.bookings[0]);
          console.log("Flight object:", this.bookings[0].flight || this.bookings[0].Flight);
        }
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error("Error fetching bookings:", error);
      }
    });
  }
}
