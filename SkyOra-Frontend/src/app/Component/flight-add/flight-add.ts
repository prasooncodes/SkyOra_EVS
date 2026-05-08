import { Component } from '@angular/core';
import { FlightService } from '../../services/flight';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './flight-add.html',
  styleUrl: './flight-add.css',
})
export class FlightAdd {

  constructor(private flightService: FlightService) {}

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

    const formData = new FormData();

    formData.append('FlightNo', this.flightForm.value.flightNo!);
    formData.append('Source', this.flightForm.value.source!);
    formData.append('Destination', this.flightForm.value.destination!);
    formData.append('DepartureTime', this.flightForm.value.departureTime!);
    formData.append('ArrivalTime', this.flightForm.value.arrivalTime!);

    formData.append('TotalBusinessSeats', this.flightForm.value.totalBusinessSeats!.toString());
    formData.append('TotalEconomySeats', this.flightForm.value.totalEconomySeats!.toString());
    formData.append('AvailableBusinessSeats', this.flightForm.value.availableBusinessSeats!.toString());
    formData.append('AvailableEconomySeats', this.flightForm.value.availableEconomySeats!.toString());

    formData.append('BusinessPrice', this.flightForm.value.businessPrice!.toString());
    formData.append('EconomyPrice', this.flightForm.value.economyPrice!.toString());

    this.flightService.addFlight(formData).subscribe(() => {
      alert('Flight Added Successfully');
      this.flightForm.reset();
    });
  }
  get fg() {
    return this.flightForm.controls;
  }
}

