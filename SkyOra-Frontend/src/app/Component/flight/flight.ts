import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './flight.html',
  styleUrls: ['./flight.css'],
})
export class Flight implements OnInit {

  flights: any[] = [];
  private cdr=inject(ChangeDetectorRef);

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights() {
    this.flightService.getFlights().subscribe((data: any[]) => {
      this.flights = data;
      this.cdr.detectChanges(); //
    });
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