import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightInterface } from '../Models/flights';


@Injectable({
  providedIn: 'root',
})
export class FlightService {

  private apiurl = 'https://localhost:7169/api/Flight';
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getFlights():Observable<FlightInterface[]> {
    return this.http.get<FlightInterface[]>(this.apiurl);
  }

  getFlightById(id: number): Observable<FlightInterface> {
    return this.http.get<FlightInterface>(`${this.apiurl}/${id}`);
  }

  addFlight(flight: any): Observable<any> {
    return this.http.post<any>(this.apiurl, flight);
  }
  
  deleteFlight(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiurl}/${id}`);
  }
  
  editFlight(id: number, flight: any): Observable<any> {
    return this.http.put<any>(`${this.apiurl}/${id}`, flight);
  }
}
