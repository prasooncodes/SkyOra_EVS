import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-travel-certificate',
  imports: [CommonModule, FormsModule],
  templateUrl: './travel-certificate.html',
  styleUrl: './travel-certificate.css',
})
export class TravelCertificate {
  showGenerated = false;

  certificate = {
    passengerName: '',
    pnrNumber: '',
    flightNumber: '',
    origin: '',
    destination: '',
    travelDate: '',
    formattedTravelDate: '',
  };

  onGenerateCertificate(): void {
    this.showGenerated = true;
    this.updateFormattedDate();
  }

  updateFormattedDate(): void {
    if (!this.certificate.travelDate) {
      this.certificate.formattedTravelDate = 'Please select a travel date';
      return;
    }

    const travelDate = new Date(this.certificate.travelDate);
    this.certificate.formattedTravelDate = travelDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  downloadCertificate(): void {
    if (!this.showGenerated) {
      alert('Please generate the certificate first.');
      return;
    }

    const certificateElement = document.getElementById('certificatePreview');
    const certificateHtml = certificateElement
      ? certificateElement.outerHTML
      : this.buildCertificateHtml();

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SkyOra Travel Certificate</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #f4f7fc;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
    }
    .certificate-border {
      background: #ffffff;
      padding: 24px;
      border: 8px double #c5a059;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
      position: relative;
      background-color: #fdfdfa;
    }
    .certificate-inner {
      border: 1px solid rgba(197, 160, 89, 0.4);
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .corner-design {
      position: absolute;
      width: 25px;
      height: 25px;
      border: 3px solid #0d1e3d;
    }
    .top-left { top: 12px; left: 12px; border-right: none; border-bottom: none; }
    .top-right { top: 12px; right: 12px; border-left: none; border-bottom: none; }
    .bottom-left { bottom: 12px; left: 12px; border-right: none; border-top: none; }
    .bottom-right { bottom: 12px; right: 12px; border-left: none; border-top: none; }
    .cert-header { margin-bottom: 30px; }
    .cert-logo-mark {
      font-size: 2.2rem;
      color: #0d1e3d;
      transform: rotate(45deg);
      display: inline-block;
      margin-bottom: 5px;
    }
    .cert-airline-name {
      font-size: 1.4rem;
      color: #0d1e3d;
      letter-spacing: 4px;
      margin: 0 0 6px 0;
      font-weight: 700;
    }
    .cert-doc-type {
      font-size: 0.85rem;
      color: #c5a059;
      letter-spacing: 2px;
      font-weight: 700;
      border-top: 1px solid #c5a059;
      border-bottom: 1px solid #c5a059;
      padding: 3px 15px;
    }
    .cert-body { width: 100%; }
    .cert-salutation {
      font-style: italic;
      color: #777777;
      margin-bottom: 5px;
    }
    .cert-passenger-name {
      font-size: 2.2rem;
      color: #0d1e3d;
      font-family: 'Georgia', serif;
      margin: 0 0 15px 0;
      font-weight: 400;
    }
    .cert-statement {
      font-size: 0.95rem;
      color: #444444;
      line-height: 1.6;
      max-width: 520px;
      margin: 0 auto 30px auto;
    }
    .cert-data-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background-color: #fcfbfa;
      border: 1px solid rgba(197, 160, 89, 0.4);
      max-width: 550px;
      margin: 0 auto 40px auto;
    }
    .data-cell {
      padding: 12px 15px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 4px;
      border: 1px solid rgba(197, 160, 89, 0.15);
    }
    .grid-span-2 {
      grid-column: span 2;
      border-top: 1px solid rgba(197, 160, 89, 0.3);
    }
    .cell-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #777777;
      letter-spacing: 0.5px;
    }
    .cell-value {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0d1e3d;
    }
    .cert-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      max-width: 550px;
      margin-top: auto;
    }
    .signature-block { text-align: left; }
    .signature-font {
      font-family: 'Brush Script MT', 'cursive', sans-serif;
      font-size: 1.6rem;
      color: #22427c;
    }
    .signature-line {
      border-bottom: 1.5px solid rgba(13, 30, 61, 0.3);
      width: 180px;
      padding-bottom: 5px;
      margin-bottom: 5px;
    }
    .signature-title {
      font-size: 0.75rem;
      color: #777777;
      text-transform: uppercase;
    }
    .verification-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    .qr-code-placeholder {
      width: 65px;
      height: 65px;
      border: 2px solid #0d1e3d;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      background-color: white;
    }
    .qr-text {
      font-size: 0.55rem;
      font-weight: 900;
      color: #0d1e3d;
      text-align: center;
      line-height: 1;
    }
  </style>
</head>
<body>
  ${certificateHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SkyOra-Certificate-${this.certificate.pnrNumber || 'certificate'}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private buildCertificateHtml(): string {
    return `
      <div class="certificate-border">
        <div class="certificate-inner">
          <div class="cert-header">
            <div class="cert-logo-mark">✈</div>
            <h3 class="cert-airline-name">SKYORA AIRLINES</h3>
            <span class="cert-doc-type">OFFICIAL Health Insurance CERTIFICATE</span>
          </div>
          <div class="cert-body">
            <p class="cert-salutation">This document hereby verifies that</p>
            <h2 class="cert-passenger-name">${this.certificate.passengerName}</h2>
            <div class="cert-data-grid">
              <div class="data-cell"><span class="cell-label">Booking Reference (PNR)</span><span class="cell-value">${this.certificate.pnrNumber}</span></div>
              <div class="data-cell"><span class="cell-label">Flight Route Code</span><span class="cell-value">${this.certificate.flightNumber}</span></div>
              <div class="data-cell"><span class="cell-label">Departure Station</span><span class="cell-value">${this.certificate.origin}</span></div>
              <div class="data-cell"><span class="cell-label">Arrival Station</span><span class="cell-value">${this.certificate.destination}</span></div>
              <div class="data-cell grid-span-2"><span class="cell-label">Official Confirmed Date of Departure</span><span class="cell-value">${this.certificate.formattedTravelDate}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
