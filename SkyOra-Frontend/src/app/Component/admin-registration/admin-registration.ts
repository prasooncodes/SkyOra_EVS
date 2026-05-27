import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserServices } from '../../services/user';

@Component({
  selector: 'app-admin-registration',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-registration.html',
  styleUrl: './admin-registration.css',
})
export class AdminRegistration {
  name = '';
  age = '';
  gender = '';
  role = 'Admin';
  email = '';
  password = '';
  confirmPassword = '';
  adminCode = '';
  private readonly validAdminCode = '12345';
  isAdminCodeVerified = false;
  error = '';
  success = '';
  emailError = '';

  constructor(private userService: UserServices, private router: Router) {}

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validateEmail() {
    if (!this.email) {
      this.emailError = 'Email is required.';
      return;
    }

    this.emailError = this.isValidEmail(this.email) ? '' : 'Please enter a valid email address.';
  }

  verifyAdminCode() {
    this.error = '';
    this.success = '';

    if (!this.adminCode) {
      this.error = 'Admin code is required.';
      return;
    }

    if (this.adminCode !== this.validAdminCode) {
      this.error = 'Invalid admin code. Please try again.';
      this.isAdminCodeVerified = false;
      return;
    }

    this.isAdminCodeVerified = true;
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    this.validateEmail();

    if (!this.isAdminCodeVerified) {
      this.error = 'Please verify the admin code before registering.';
      return;
    }

    if (!this.name || !this.age || !this.gender || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required.';
      return;
    }

    if (this.emailError) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Password and confirm password do not match.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    this.userService.register({
      name: this.name,
      age: parseInt(this.age),
      gender: this.gender,
      role: 'Admin',
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.success = 'Registration successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err: any) => {
        this.error = err?.error || 'Registration failed. Please try again.';
      },
    });
  }
}
