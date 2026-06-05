import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seatselection',
  imports: [CommonModule, RouterLink],
  templateUrl: './seatselection.html',
  styleUrl: './seatselection.css',
})
export class Seatselection {
  readonly highlights = [
    {
      icon: '✈️',
      title: 'Choose your perfect seat',
      description: 'Pick window, aisle, or front-row comfort while you book your flight.'
    },
    {
      icon: '🧭',
      title: 'Travel with confidence',
      description: 'See fare details, cabin layout, and flight options before confirming.'
    },
    {
      icon: '⚡',
      title: 'Fast booking flow',
      description: 'Move from search to seat selection to payment in just a few steps.'
    }
  ];

  readonly benefits = [
    'Visual seat map for easier decisions',
    'Round-trip and one-way booking support',
    'Passenger-friendly summary before checkout',
    'Secure payment and ticket confirmation'
  ];

  readonly journeySteps = [
    {
      step: '01',
      title: 'Search flights',
      description: 'Enter source, destination, and travel date to explore available flights.'
    },
    {
      step: '02',
      title: 'Select your seat',
      description: 'Assign seats visually so everyone travels comfortably together.'
    },
    {
      step: '03',
      title: 'Confirm & fly',
      description: 'Review the cart, pay securely, and get your booking instantly.'
    }
  ];

  readonly stats = [
    { value: '2D', label: 'Cockpit-style seat view' },
    { value: '100%', label: 'Booking visibility' },
    { value: '24/7', label: 'Fast self-service booking' }
  ];
}
