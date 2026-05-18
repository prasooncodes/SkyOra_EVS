import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-ticket',
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-ticket.html',
  styleUrls: ['./flight-ticket.css'],
})
export class FlightTicket {
  showTicket = false;

  ticket = {
    passengerName: '',
    pnr: '',
    flightNumber: '',
    origin: '',
    destination: '',
    travelDate: '',
    formattedDate: '',
    boardingTime: '',
    departureTime: '',
    arrivalTime: '',
    seat: '',
    gate: '',
    travelClass: 'Economy',
    boardingGroup: 'A',
  };

  onGenerateTicket(): void {
    this.showTicket = true;
    this.updateFormattedDate();
  }

  updateFormattedDate(): void {
    if (!this.ticket.travelDate) {
      this.ticket.formattedDate = 'Select travel date';
      return;
    }
    const travelDate = new Date(this.ticket.travelDate);
    this.ticket.formattedDate = travelDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  downloadTicket(): void {
    if (!this.showTicket) {
      alert('Please generate the ticket first.');
      return;
    }

    const ticketElement = document.getElementById('ticketPreview');
    const ticketHtml = ticketElement ? ticketElement.outerHTML : this.buildTicketHtml();

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SkyOra Flight Ticket</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #eef2ff;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #17243a;
    }
    .ticket-shell {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(24, 44, 89, 0.12);
      border-top: 6px solid #5c0fd9;
    }
    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px 32px;
      background: linear-gradient(135deg, #5c0fd9 0%, #ff6300 100%);
      color: white;
      gap: 20px;
    }
    .ticket-brand {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .ticket-status {
      background: rgba(255, 255, 255, 0.2);
      padding: 12px 18px;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
    .ticket-body {
      padding: 32px;
    }
    .route-section {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 18px;
      margin-bottom: 24px;
    }
    .route-card {
      background: #f8f9ff;
      border: 1px solid rgba(92, 15, 217, 0.12);
      border-radius: 22px;
      padding: 22px;
    }
    .route-card h2 {
      margin: 0 0 8px;
      font-size: 1.45rem;
      color: #0d1e3d;
    }
    .route-card p {
      margin: 0;
      color: #5f6c8a;
      font-size: 0.95rem;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .detail-panel {
      background: white;
      border: 1px solid rgba(92, 15, 217, 0.12);
      border-radius: 18px;
      padding: 20px;
    }
    .detail-label {
      display: block;
      font-size: 0.78rem;
      text-transform: uppercase;
      color: #7b86a2;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
    }
    .detail-value {
      font-size: 1rem;
      font-weight: 700;
      color: #17243a;
      line-height: 1.5;
    }
    .passenger-strip {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      margin-top: 28px;
      padding: 22px;
      background: linear-gradient(180deg, #eef2ff 0%, #ffffff 100%);
      border: 1px dashed rgba(92, 15, 217, 0.18);
      border-radius: 22px;
      align-items: center;
    }
    .passenger-info {
      margin: 0;
      color: #17243a;
      font-size: 1.3rem;
      font-weight: 700;
    }
    .passenger-meta {
      margin: 0;
      color: #5f6c8a;
      font-size: 0.95rem;
      line-height: 1.7;
      text-align: right;
    }
    .barcode {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 142px;
      min-height: 54px;
      background: #0d1e3d;
      color: white;
      border-radius: 18px;
      font-size: 0.8rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .ticket-footnote {
      margin-top: 28px;
      color: #5f6c8a;
      font-size: 0.95rem;
      line-height: 1.8;
    }
    @media (max-width: 860px) {
      .route-section,
      .details-grid,
      .passenger-strip {
        display: block;
      }
      .passenger-meta {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  ${ticketHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SkyOra-Ticket-${this.ticket.pnr || 'ticket'}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private buildTicketHtml(): string {
    return `
      <div class="ticket-shell">
        <div class="ticket-header">
          <div>
            <p class="ticket-brand">SkyOra Airlines</p>
            <p style="margin:4px 0 0; font-size:0.95rem; color: rgba(255,255,255,0.9);">Flight Ticket</p>
          </div>
          <span class="ticket-status">CONFIRMED</span>
        </div>
        <div class="ticket-body">
          <div class="route-section">
            <div class="route-card">
              <h2>${this.ticket.origin}</h2>
              <p>Departure City</p>
            </div>
            <div class="route-card">
              <h2>${this.ticket.flightNumber}</h2>
              <p>Flight Number</p>
            </div>
            <div class="route-card">
              <h2>${this.ticket.destination}</h2>
              <p>Arrival City</p>
            </div>
          </div>
          <div class="details-grid">
            <div class="detail-panel">
              <span class="detail-label">Passenger</span>
              <span class="detail-value">${this.ticket.passengerName}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">PNR</span>
              <span class="detail-value">${this.ticket.pnr}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">Class</span>
              <span class="detail-value">${this.ticket.travelClass}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">Boarding Group</span>
              <span class="detail-value">${this.ticket.boardingGroup}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">Gate</span>
              <span class="detail-value">${this.ticket.gate || 'TBD'}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">Seat</span>
              <span class="detail-value">${this.ticket.seat || 'Unassigned'}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">Boarding Time</span>
              <span class="detail-value">${this.ticket.boardingTime || '--:--'}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">Departure Time</span>
              <span class="detail-value">${this.ticket.departureTime || '--:--'}</span>
            </div>
            <div class="detail-panel">
              <span class="detail-label">Arrival Time</span>
              <span class="detail-value">${this.ticket.arrivalTime || '--:--'}</span>
            </div>
          </div>
          <div class="passenger-strip">
            <p class="passenger-info">${this.ticket.passengerName}</p>
            <div class="passenger-meta">
              <p>${this.ticket.origin} → ${this.ticket.destination}</p>
              <p>${this.ticket.formattedDate}</p>
            </div>
          </div>
          <div class="ticket-footnote">
            Please arrive at the boarding gate at least 45 minutes before departure. Have your travel documents and boarding pass ready.
          </div>
          <div class="barcode">BOARDING READY</div>
        </div>
      </div>
    `;
  }
}
