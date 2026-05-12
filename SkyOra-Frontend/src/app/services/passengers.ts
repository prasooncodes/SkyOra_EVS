import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class Passengers {

  private apiUrl = 'https://localhost:7169/api/Passengers';

  constructor(private http: HttpClient, private authservice: AuthService) { }

  getPassengers() {
     return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  createPassenger(passengerData: any) {
    return this.http.post(this.apiUrl, passengerData, this.getAuthHeaders());
  }

  deletePassenger(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  getPassengerById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
   private getAuthHeaders() {
    const token = this.authservice.getToken();
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  }
}
