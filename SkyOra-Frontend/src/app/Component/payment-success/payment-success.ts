import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingFlowService, PendingBookingPayload } from '../../services/booking-flow';
import { FlightService } from '../../services/flight';
import { FlightInterface } from '../../Models/flights';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.html',
  styleUrls: ['./payment-success.css'],
})
export class PaymentSuccess {
  private readonly bookingFlowService = inject(BookingFlowService);
  private readonly flightService = inject(FlightService);

  downloadTicket(): void {
    const booking = this.bookingFlowService.getLastConfirmedBooking();

    if (!booking) {
      alert('Unable to generate ticket: booking details are missing.');
      return;
    }

    this.flightService.getFlightById(booking.FlightId).subscribe({
      next: (flight: FlightInterface) => {
        this.downloadHtmlTicket(booking, flight);
      },
      error: () => {
        this.downloadHtmlTicket(booking, null);
      }
    });
  }

  private downloadHtmlTicket(booking: PendingBookingPayload, flight: FlightInterface | null): void {
    const passengerRows = booking.Passengers.map((passenger) => `
        <tr>
          <td>${passenger.Name}</td>
          <td>${passenger.Age}</td>
          <td>${passenger.Gender}</td>
          <td>${passenger.SeatType}</td>
        </tr>
      `).join('');

    const flightNumber = flight?.FlightNo || booking.FlightId.toString();
    const source = flight?.Source || 'Unknown';
    const destination = flight?.Destination || 'Unknown';
    const departureTime = flight?.DepartureTime ? new Date(flight.DepartureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : booking.BookingDate;
    const arrivalTime = flight?.ArrivalTime ? new Date(flight.ArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : booking.ReturnDate;
    const travelDate = booking.BookingDate ? new Date(booking.BookingDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD';
    const travelClass = booking.Passengers?.[0]?.SeatType || 'Economy';
    const gate = 'TBD';
    const ticketName = `SkyOra-Ticket-${booking.FlightId}-${Date.now()}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SkyOra Flight Ticket</title>
  <style>
    body { margin: 0; padding: 0; background: #eef2ff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .ticket { max-width: 900px; margin: 24px auto; background: white; border-radius: 28px; overflow: hidden; box-shadow: 0 24px 60px rgba(24, 44, 89, 0.12); border-top: 6px solid #5c0fd9; }
    .ticket-header { display: flex; justify-content: space-between; align-items: center; padding: 28px 32px; background: linear-gradient(135deg, #5c0fd9 0%, #ff6300 100%); color: white; }
    .ticket-header h1 { margin: 0; font-size: 1.6rem; letter-spacing: 1px; }
    .ticket-header .status { background: rgba(255,255,255,0.2); padding: 12px 18px; border-radius: 999px; font-weight: 700; letter-spacing: 0.08em; }
    .ticket-body { padding: 32px; }
    .route-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-bottom: 26px; }
    .route-card { background: #f8f9ff; border: 1px solid rgba(92, 15, 217, 0.12); border-radius: 22px; padding: 22px; }
    .route-card h2 { margin: 0 0 8px; font-size: 1.5rem; color: #0d1e3d; }
    .route-card p { margin: 0; color: #5f6c8a; }
    .details-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 28px; }
    .detail-panel { background: white; border: 1px solid rgba(92, 15, 217, 0.12); border-radius: 18px; padding: 20px; }
    .detail-label { display: block; font-size: 0.78rem; text-transform: uppercase; color: #7b86a2; margin-bottom: 10px; letter-spacing: 0.08em; }
    .detail-value { font-size: 1rem; font-weight: 700; color: #17243a; }
    .passengers { margin-bottom: 28px; }
    .passengers h3 { margin: 0 0 12px; font-size: 1.1rem; color: #0d1e3d; }
    .passenger-table { width: 100%; border-collapse: collapse; }
    .passenger-table th, .passenger-table td { padding: 12px 14px; border: 1px solid rgba(92, 15, 217, 0.12); }
    .passenger-table th { background: #f3f5ff; text-align: left; color: #5f6c8a; font-weight: 700; }
    .passenger-table td { color: #17243a; }
    .footer { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .notes { color: #5f6c8a; line-height: 1.7; max-width: 620px; }
    .barcode { min-width: 140px; min-height: 54px; background: #0d1e3d; color: white; display: inline-flex; align-items: center; justify-content: center; border-radius: 18px; font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; }
    @media (max-width: 860px) { .route-grid, .details-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <h1>SkyOra Airlines</h1>
      <span class="status">CONFIRMED</span>
    </div>
    <div class="ticket-body">
      <div class="route-grid">
        <div class="route-card"><h2>${source}</h2><p>Departure</p></div>
        <div class="route-card"><h2>${flightNumber}</h2><p>Flight Number</p></div>
        <div class="route-card"><h2>${destination}</h2><p>Arrival</p></div>
      </div>
      <div class="details-grid">
        <div class="detail-panel"><span class="detail-label">Travel Date</span><span class="detail-value">${travelDate}</span></div>
        <div class="detail-panel"><span class="detail-label">Boarding Time</span><span class="detail-value">${departureTime}</span></div>
        <div class="detail-panel"><span class="detail-label">Arrival Time</span><span class="detail-value">${arrivalTime}</span></div>
        <div class="detail-panel"><span class="detail-label">Class</span><span class="detail-value">${travelClass}</span></div>
        <div class="detail-panel"><span class="detail-label">Gate</span><span class="detail-value">${gate}</span></div>
        <div class="detail-panel"><span class="detail-label">PNR</span><span class="detail-value">${booking.FlightId}</span></div>
      </div>
      <div class="passengers">
        <h3>Passengers</h3>
        <table class="passenger-table">
          <thead>
            <tr><th>Name</th><th>Age</th><th>Gender</th><th>Seat Type</th></tr>
          </thead>
          <tbody>${passengerRows}</tbody>
        </table>
      </div>
      <div class="footer">
        <div class="notes">Please arrive at the boarding gate 45 minutes before departure and keep this ticket handy for verification.</div>
        <div class="barcode">BOARDING READY</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${ticketName}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
