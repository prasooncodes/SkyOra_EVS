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

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  }
}
