import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight';
import { FlightInterface } from '../../Models/flights';

@Component({
  selector: 'app-network',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-network.html', 
  styleUrls: ['./my-network.css']    
})
export class NetworkComponent implements AfterViewInit {
  private map: any;
  cityCount: number = 0;

  private cityCoords: { [key: string]: [number, number] } = {
    'Mumbai': [19.0760, 72.8777], 'Delhi': [28.6139, 77.2090],
    'Bengaluru': [12.9716, 77.5946], 'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639], 'Hyderabad': [17.3850, 78.4867],
    'Ahmedabad': [23.0225, 72.5714], 'Pune': [18.5204, 73.8567],
    'Kochi': [9.9312, 76.2673], 'Lucknow': [26.8467, 80.9462],
    'Jaipur': [26.9124, 75.7873], 'Chandigarh': [30.7333, 76.7794],
    'Indore': [22.7196, 75.8577], 'Guwahati': [26.1445, 91.7362],
    'Bhubaneswar': [20.2961, 85.8245], 'Varanasi': [25.3176, 82.9739],
    'Patna': [25.5941, 85.1376], 'Nagpur': [21.1458, 79.0882],
    'Coimbatore': [11.0168, 76.9558], 'Visakhapatnam': [17.6868, 83.2185],
    'Surat': [21.1702, 72.8311], 'Amritsar': [31.6340, 74.8723],
    'Srinagar': [34.0837, 74.7973], 'Goa': [15.2993, 74.1240],
    'Ranchi': [23.3441, 85.3094], 'Raipur': [21.2514, 81.6296],
    'Mangalore': [12.9141, 74.8560], 'Madurai': [9.9252, 78.1198],
    'Agartala': [23.8315, 91.2868], 'Allahabad': [25.4358, 81.8463]
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private flightService: FlightService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      
      this.map = L.map('map').setView([22.5, 82.0], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; SkyOra Network'
      }).addTo(this.map);

      setTimeout(() => { this.map.invalidateSize(); }, 300);

      this.loadMarkers(L);
      this.drawFlightPaths(L);
    }
  }

  private normalize(name: string): string {
    if (!name) return '';
    return name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
  }

  private loadMarkers(L: any): void {
    this.flightService.getOperationalCities().subscribe({
      next: (cities) => {
        this.cityCount = cities.length;

        cities.forEach(city => {
          const normalizedCity = this.normalize(city);
          const coords = this.cityCoords[normalizedCity];

          if (coords) {
            L.circle(coords, {
              radius: 35000, color: '#5C0FD9', fillColor: '#5C0FD9', fillOpacity: 0.1, weight: 0
            }).addTo(this.map);

            L.circleMarker(coords, {
              radius: 8, fillColor: "#FF6300", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8
            }).addTo(this.map).bindPopup(`<b>SkyOra Hub: ${normalizedCity}</b>`);
          }
        });

        this.cdr.detectChanges(); 
      },
      error: (err) => console.error(err)
    });
  }

  private drawFlightPaths(L: any): void {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        flights.forEach(flight => {
          const startKey = this.normalize(flight.Source);
          const endKey = this.normalize(flight.Destination);

          const start = this.cityCoords[startKey];
          const end = this.cityCoords[endKey];

          if (start && end) {
            const flightLine = L.polyline([start, end], {
              color: '#d63384', weight: 1.5, opacity: 0.5, smoothFactor: 1
            }).addTo(this.map);

            flightLine.bindPopup(`
              <div style="text-align: center;">
                <strong style="color: #5C0FD9;">Route: ${startKey} ✈ ${endKey}</strong><br>
                <small>Operated by SkyOra Air</small>
              </div>
            `);

            flightLine.on('mouseover', () => flightLine.setStyle({ color: '#5C0FD9', weight: 3, opacity: 1 }));
            flightLine.on('mouseout', () => flightLine.setStyle({ color: '#d63384', weight: 1.5, opacity: 0.5 }));
          }
        });
        this.cdr.detectChanges();
      }
    });
  }
}
