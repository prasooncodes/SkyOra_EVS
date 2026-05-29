import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet,Router } from '@angular/router';

@Component({
  selector: 'app-inprogress',
  imports: [ CommonModule],
  templateUrl: './inprogress.html',
  styleUrl: './inprogress.css',
})
export class Inprogress {

  private router=inject(Router);

  goToAddons() {
    this.router.navigate(['/addons']);
  }
}
