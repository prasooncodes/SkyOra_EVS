import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:5084/api/Booking';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBookings() {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  createBooking(bookingData: any) {
    return this.http.post(this.apiUrl, bookingData, this.getAuthHeaders());
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
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

  cancelBooking(id: number) {
    return this.http.put(`${this.apiUrl}/cancel/${id}`, {}, this.getAuthHeaders());
  }
}
