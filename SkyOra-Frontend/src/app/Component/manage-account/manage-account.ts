import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from '../../services/user';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-manage-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-account.html',
  styleUrl: './manage-account.css',
})
export class ManageAccount implements OnInit {
  userId!: number; // Stores the active user ID required by the service
  name = '';
  age = '';
  gender = '';
  role = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(private userService: UserServices, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Retrieve current logged-in user id from AuthService
    const id = this.authService.getUserId();
    if (!id || id === 0) {
      this.error = 'You must be logged in to manage your account.';
      // Optionally redirect to login
      // this.router.navigate(['/login']);
      return;
    }
    this.userId = id;

    // Prefill the form with user data
    this.userService.getUserById(this.userId).subscribe({
      next: (u: any) => {
        this.name = u.Name || u.name || '';
        this.age = (u.Age ?? u.age ?? '').toString();
        this.gender = u.Gender || u.gender || '';
        this.role = u.Role || u.role || '';
        this.email = u.Email || u.email || '';
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
      }
    });
  }

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.name || !this.age || !this.gender || !this.role || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required.';
      return;
    }

    const ageParsed = parseInt(this.age, 10);
    if (isNaN(ageParsed)) {
      this.error = 'Please enter a valid number for age.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Password and confirm password do not match.';
      return;
    }

    // Passes both user ID and the expanded data object to the updated service
    this.userService.editUser(this.userId, {
      name: this.name,
      age: ageParsed,
      gender: this.gender,
      role: this.role,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.success = 'Profile updated successfully. Redirecting to home...';
        this.authService.logout(); 
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err: any) => {
        this.error = err?.error || 'Failed to update profile. Please try again.';
      },
    });
  }
}
