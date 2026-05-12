import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlightService } from '../../services/flight'; // Import your service

@Component({
  selector: 'app-network',
  standalone: true,
  template: `<div id="map" style="height: 600px; width: 100%; border-radius: 15px;"></div>`,
  styles: [`#map { margin-top: 20px; border: 3px solid #FF6300; }`]
})
export class NetworkComponent implements AfterViewInit {
  // Mapping city names to Lat/Lng
  private cityCoords: { [key: string]: [number, number] } = {
    // --- Tier 1 (Metros) ---
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.6139, 77.2090],
  'Bengaluru': [12.9716, 77.5946],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Hyderabad': [17.3850, 78.4867],
  'Ahmedabad': [23.0225, 72.5714],
  'Pune': [18.5204, 73.8567],

  // --- Tier 2 (Major Operational Hubs) ---
  'Kochi': [9.9312, 76.2673],
  'Lucknow': [26.8467, 80.9462],
  'Jaipur': [26.9124, 75.7873],
  'Chandigarh': [30.7333, 76.7794],
  'Indore': [22.7196, 75.8577],
  'Guwahati': [26.1445, 91.7362],
  'Bhubaneswar': [20.2961, 85.8245],
  'Varanasi': [25.3176, 82.9739],
  'Patna': [25.5941, 85.1376],
  'Nagpur': [21.1458, 79.0882],
  'Coimbatore': [11.0168, 76.9558],
  'Visakhapatnam': [17.6868, 83.2185],
  'Surat': [21.1702, 72.8311],
  'Amritsar': [31.6340, 74.8723],
  'Srinagar': [34.0837, 74.7973],
  'Goa': [15.2993, 74.1240],
  'Ranchi': [23.3441, 85.3094],
  'Raipur': [21.2514, 81.6296],
  'Mangalore': [12.9141, 74.8560],
  'Madurai': [9.9252, 78.1198],
  'Agartala': [23.8315, 91.2868]
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private flightService: FlightService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      const map = L.map('map').setView([20.5937, 78.9629], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Fetch dynamic cities from Backend
      this.flightService.getOperationalCities().subscribe({
        next: (cities) => {
          cities.forEach(cityName => {
            const coords = this.cityCoords[cityName]; // Match DB name to Coords
            if (coords) {
              L.circleMarker(coords, {
                color: '#5C0FD9', // Akasa Purple
                fillColor: '#FF6300', // Akasa Orange
                fillOpacity: 0.9,
                radius: 10
              }).addTo(map).bindPopup(`<b>SkyOra Hub: ${cityName}</b>`);
            }
          });
        },
        error: (err) => console.error('Could not fetch network cities', err)
      });
    }
  }
}
