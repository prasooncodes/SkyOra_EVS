import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './flight.html',
  styleUrls: ['./flight.css'],
})
export class Flight implements OnInit {
  flights: any[] = [];
  filteredFlights: any[] = [];
  searchTerm = '';
  pagedFlights: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  private cdr=inject(ChangeDetectorRef);

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights() {
    this.flightService.getFlights().subscribe((data: any[]) => {
      this.flights = data || [];
      this.applyFilter();
      this.cdr.detectChanges();
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredFlights = [...this.flights];
    } else {
      this.filteredFlights = this.flights.filter(flight => {
        const flightNo = (flight.FlightNo || flight.flightNo || '').toString().toLowerCase();
        const source = (flight.Source || flight.source || '').toString().toLowerCase();
        const dest = (flight.Destination || flight.destination || '').toString().toLowerCase();
        return flightNo.includes(term) || source.includes(term) || dest.includes(term);
      });
    }

    this.totalPages = Math.max(1, Math.ceil(this.filteredFlights.length / this.itemsPerPage));
    this.currentPage = 1;
    this.updatePagedFlights();
  }

  private updatePagedFlights(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedFlights = this.filteredFlights.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedFlights();
  }

  trackByFlightId(_: number, flight: any): number {
    return flight.flightId ?? flight.FlightId;
  }

  deleteFlight(id: number) {
    const flightId = Number(id);
    if (confirm('Are you sure you want to delete this flight?')) {
      this.flightService.deleteFlight(flightId).subscribe((result: number) => {

        if (result!=null)
          alert('Flight deleted successfully!');
        else
          alert('Failed to delete flight!');

        this.loadFlights();
      });
    }
  }
}