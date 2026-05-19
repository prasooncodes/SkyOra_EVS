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
  role = 'User';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  captchaError = '';
  captchaQuestion = 'Type the characters shown below to verify you are human';
  captchaInput = '';
  captchaText = '';

  constructor(private userService: UserServices, private router: Router) {
    this.resetCaptcha();
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    this.captchaError = '';

    if (!this.name || !this.age || !this.gender || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required.';
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

    if (!this.validateCaptcha()) {
      return;
    }

    this.userService.register({
      name: this.name,
      age: parseInt(this.age),
      gender: this.gender,
      role: 'User',
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

  onAdminRegister() {
    this.router.navigate(['/admin-register']);
  }

  resetCaptcha(): void {
    this.captchaText = this.generateCaptchaText(6);
    this.captchaInput = '';
    this.captchaError = '';
  }

  validateCaptcha(): boolean {
    if (!this.captchaInput?.trim()) {
      this.captchaError = 'Please type the text shown in the verification box.';
      return false;
    }

    if (this.captchaInput.trim().toLowerCase() !== this.captchaText.toLowerCase()) {
      this.captchaError = 'Text verification failed. Please try again.';
      this.resetCaptcha();
      return false;
    }

    return true;
  }

  private generateCaptchaText(length: number): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}
