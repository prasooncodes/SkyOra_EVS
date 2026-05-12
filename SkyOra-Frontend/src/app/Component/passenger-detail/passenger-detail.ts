import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { Passengers } from '../../services/passengers';

@Component({
  selector: 'app-passenger-detail',
  imports: [],
  templateUrl: './passenger-detail.html',
  styleUrl: './passenger-detail.css',
})
export class PassengerDetail implements OnInit {

  passanger: any []=[];
  private cdr= inject(ChangeDetectorRef);
  constructor(private http: HttpClient, private passengerservice:Passengers) {}
  ngOnInit(): void {
    // Initialization logic for passenger detail component
  }
}
