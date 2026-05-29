import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pet-policy',
  imports: [CommonModule, RouterLink],
  templateUrl: './pet-policy.html',
  styleUrl: './pet-policy.css',
})
export class PetPolicy {}
