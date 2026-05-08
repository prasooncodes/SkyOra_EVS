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

  addFlight(formdata: FormData): Observable<FlightInterface> {
    return this.http.post<FlightInterface>(this.apiurl, formdata);
  }
  
  deleteFlight(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiurl}/${id}`);
  }
  
  editFlight(id: number, formdata: any): Observable<any> {
    return this.http.put<FlightInterface>(`${this.apiurl}/${id}`, formdata);
  }
}
