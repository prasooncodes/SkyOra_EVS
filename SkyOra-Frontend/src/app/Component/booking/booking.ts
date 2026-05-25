import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
})
export class Booking implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  searchTerm = '';
  pagedBookings: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;

  constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef) {} 

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        this.bookings = data || [];
        this.applyFilter();
        console.log("Bookings fetched successfully:", this.bookings);
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

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredBookings = [...this.bookings];
    } else {
      this.filteredBookings = this.bookings.filter(booking => {
        const bookingId = (booking.BookingId || booking.bookingId || '').toString().toLowerCase();
        const flightNo = (booking?.flight?.flightNo || booking?.Flight?.FlightNo || '').toString().toLowerCase();
        const source = (booking?.flight?.source || booking?.Flight?.Source || '').toString().toLowerCase();
        const dest = (booking?.flight?.destination || booking?.Flight?.Destination || '').toString().toLowerCase();
        const passengerNames = (booking.Passengers || booking.passengers || [])
          .map((p: any) => (p.Name || p.name || '').toString().toLowerCase())
          .join(' ');
        return bookingId.includes(term) || flightNo.includes(term) || source.includes(term) || dest.includes(term) || passengerNames.includes(term);
      });
    }
    this.totalPages = Math.max(1, Math.ceil(this.filteredBookings.length / this.itemsPerPage));
    this.currentPage = 1;
    this.updatePagedBookings();
  }

  private updatePagedBookings(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedBookings = this.filteredBookings.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedBookings();
  }
}
