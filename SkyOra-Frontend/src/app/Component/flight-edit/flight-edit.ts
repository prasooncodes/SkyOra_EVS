import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-edit.html',
  styleUrls: ['./flight-edit.css']
})
export class FlightEdit implements OnInit {

  flightId!: number;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router
  ) {}

  // ✅ Flight Form
  flightForm = new FormGroup({
    flightNo: new FormControl('', Validators.required),
    source: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z ]+')]),
    destination: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z ]+')]),
    departureTime: new FormControl('', Validators.required),
    arrivalTime: new FormControl('', Validators.required),

    totalBusinessSeats: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    totalEconomySeats: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    availableBusinessSeats: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    availableEconomySeats: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),

    businessPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]),
    economyPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')])
  });

  ngOnInit(): void {
    this.flightId = Number(this.route.snapshot.paramMap.get('id'));

    this.flightService.getFlightById(this.flightId).subscribe((res: any) => {

      // ✅ Patch using API response (PascalCase → camelCase)
      this.flightForm.patchValue({
        flightNo: res.FlightNo,
        source: res.Source,
        destination: res.Destination,
        departureTime: res.DepartureTime,
        arrivalTime: res.ArrivalTime,

        totalBusinessSeats: res.TotalBusinessSeats,
        totalEconomySeats: res.TotalEconomySeats,
        availableBusinessSeats: res.AvailableBusinessSeats,
        availableEconomySeats: res.AvailableEconomySeats,

        businessPrice: res.BusinessPrice,
        economyPrice: res.EconomyPrice
      });
    });
  }

  // ✅ UPDATE METHOD
  updateFlight() {
    if (this.flightForm.invalid) return;

    const formValue = this.flightForm.value;

    const updatedFlight = {
      FlightId: this.flightId,
      FlightNo: formValue.flightNo,
      Source: formValue.source,
      Destination: formValue.destination,
      DepartureTime: formValue.departureTime,
      ArrivalTime: formValue.arrivalTime,
      TotalBusinessSeats: Number(formValue.totalBusinessSeats),
      TotalEconomySeats: Number(formValue.totalEconomySeats),
      AvailableBusinessSeats: Number(formValue.availableBusinessSeats),
      AvailableEconomySeats: Number(formValue.availableEconomySeats),
      BusinessPrice: Number(formValue.businessPrice),
      EconomyPrice: Number(formValue.economyPrice)
    };

    this.flightService.editFlight(this.flightId, updatedFlight)
      .subscribe({
        next: () => {
          alert('Flight Updated Successfully');
          this.router.navigate(['/flights']);
        },
        error: (err) => {
          console.error('Update flight error', err);
          alert('Unable to update flight. Check browser console for details.');
        }
      });
  }

  get fg() {
    return this.flightForm.controls;
  }
}
