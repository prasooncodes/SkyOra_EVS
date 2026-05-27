import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {  RecaptchaModule } from 'ng-recaptcha'; 
import { UserServices } from '../../services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RecaptchaModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  name = '';
  age = '';
  gender = '';
  role = 'User';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';

  emailError = '';

  captchaError = '';
  recaptchaToken = '';
  recaptchaSiteKey = '6Ld81_YsAAAAAEPiFnVCXhZvVyQ3Xrcl4ykaDRi6';

 


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

  onSubmit() {
    this.error = '';
    this.success = '';

    this.validateEmail();

    this.captchaError = '';
 

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

    if (!this.recaptchaToken) {
      this.captchaError = 'Please complete the captcha verification.';
      return;
    }

    this.userService.register({
      name: this.name,
      age: parseInt(this.age),
      gender: this.gender,
      role: 'User',
      email: this.email,
      password: this.password,
      captchaToken: this.recaptchaToken,
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

  onAdminRegister() {
    this.router.navigate(['/admin-register']);
  }

  onCaptchaResolved(token: string | null): void {
    this.recaptchaToken = token ?? '';
    this.captchaError = '';
  }

  onCaptchaExpired(): void {
    this.recaptchaToken = '';
    this.captchaError = 'Captcha has expired. Please verify again.';
  }

  onCaptchaError(): void {
    this.recaptchaToken = '';
    this.captchaError = 'Captcha failed to load. Please refresh the page and try again.';
  }
}
