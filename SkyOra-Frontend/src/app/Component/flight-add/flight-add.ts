import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './flight-add.html',
  styleUrls: ['./flight-add.css'],
})
export class FlightAdd {

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {}

  // ✅ FIXED: Proper FormGroup (no nesting mistake)
  flightForm = new FormGroup({
    flightNo: new FormControl('', [Validators.required]),

    source: new FormControl('', [
      Validators.required,
      Validators.pattern('[A-Za-z ]+')
    ]),

    destination: new FormControl('', [
      Validators.required,
      Validators.pattern('[A-Za-z ]+')
    ]),

    departureTime: new FormControl('', Validators.required),
    arrivalTime: new FormControl('', Validators.required),

    totalBusinessSeats: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),

    totalEconomySeats: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),

    availableBusinessSeats: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),

    availableEconomySeats: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),

    businessPrice: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+(\\.[0-9]+)?$')
    ]),

    economyPrice: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+(\\.[0-9]+)?$')
    ])
  });

  // ✅ ADD METHOD (NO CHANGE NEEDED)
  adddata() {
    if (this.flightForm.invalid) return;

    const flight = {
      FlightNo: this.flightForm.value.flightNo,
      Source: this.flightForm.value.source,
      Destination: this.flightForm.value.destination,
      DepartureTime: this.flightForm.value.departureTime,
      ArrivalTime: this.flightForm.value.arrivalTime,
      TotalBusinessSeats: Number(this.flightForm.value.totalBusinessSeats),
      TotalEconomySeats: Number(this.flightForm.value.totalEconomySeats),
      AvailableBusinessSeats: Number(this.flightForm.value.availableBusinessSeats),
      AvailableEconomySeats: Number(this.flightForm.value.availableEconomySeats),
      BusinessPrice: Number(this.flightForm.value.businessPrice),
      EconomyPrice: Number(this.flightForm.value.economyPrice)
    };

    console.log('Adding flight payload', flight);

    this.flightService.addFlight(flight).subscribe({
      next: () => {
        alert('Flight Added Successfully');
        this.flightForm.reset();
        this.router.navigate(['/flights']);
      },
      error: (err) => {
        console.error('Add flight error', err);
        alert('Unable to add flight. Check browser console for details.');
      }
    });
  }
  get fg() {
    return this.flightForm.controls;
  }
}


