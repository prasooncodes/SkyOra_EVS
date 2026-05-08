import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'https://localhost:7169/api/Booking';

  constructor(private http: HttpClient) {}

  getBookings() {
    return this.http.get(this.apiUrl);
  }

  createBooking(bookingData: any) {
    return this.http.post(this.apiUrl, bookingData);
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
