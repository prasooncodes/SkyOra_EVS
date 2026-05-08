import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserServices } from '../../services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  name = '';
  age = '';
  gender = '';
  role = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private userService: UserServices, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.name || !this.age || !this.gender || !this.role || !this.email || !this.password) {
      this.error = 'All fields are required.';
      return;
    }

    this.userService.register({
      name: this.name,
      age: parseInt(this.age),
      gender: this.gender,
      role: this.role,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.success = 'Registration successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err?.error || 'Registration failed. Please try again.';
      },
    });
  }
}
