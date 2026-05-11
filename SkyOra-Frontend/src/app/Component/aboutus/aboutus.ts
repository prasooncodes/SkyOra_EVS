import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css',
})
export class Aboutus {
  selectedCountry: string = 'India';
  phoneNumber: string = '+91 9606 11 21 31';

  updatePhone() {
    const numbers: any = {
      'India': '+91 9606 11 21 31',
      'UAE': '+971 4 123 4567',
      'USA': '+1 800 SKY ORA'
    };
    this.phoneNumber = numbers[this.selectedCountry];
  }
}
