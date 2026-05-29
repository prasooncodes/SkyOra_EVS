import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'https://localhost:7169/api/Booking';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBookings() {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  createBooking(bookingData: any) {
    return this.http.post(this.apiUrl, bookingData, this.getAuthHeaders());
  }

  sendTicket(bookingId: number) {
    return this.http.post(`${this.apiUrl}/${bookingId}/sendticket`, {}, this.getAuthHeaders());
  }

  updateBooking(id: number, bookingData: any) {
    return this.http.put(`${this.apiUrl}/${id}`, bookingData, this.getAuthHeaders());
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      ...this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  }

  getBookingById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  } 

  getReservedSeats(flightId: number) {
    return this.http.get<string[]>(`${this.apiUrl}/flight/${flightId}/reserved-seats`, this.getAuthHeaders());
  }
}
