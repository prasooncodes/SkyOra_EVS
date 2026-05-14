import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PassengerInterface } from '../Models/passengers';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  private apiurl = 'https://localhost:7169/api/Passenger';

  constructor(private http: HttpClient) {}

  // Maps directly to your [HttpPost] AddPassenger controller method
  addPassenger(passenger: PassengerInterface): Observable<any> {
    return this.http.post<any>(this.apiurl, passenger);
  }

  // Maps directly to your [HttpGet("{id}")] GetPassengerByBookingId controller method
  getPassengersByBookingId(bookingId: number): Observable<PassengerInterface[]> {
    return this.http.get<PassengerInterface[]>(`${this.apiurl}/${bookingId}`);
  }
}
