import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true, 
  imports: [CommonModule],
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
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error("Error fetching bookings:", error);
      }
    });
  }
}
