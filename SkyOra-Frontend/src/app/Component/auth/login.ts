import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserServices } from '../../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(private userService: UserServices, private router: Router) {}

  onSubmit() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Password and confirm password do not match.';
      return;
    }

    const payload = { email: this.email, password: this.password };
    console.log('Login payload:', payload);

    this.userService.login(payload).subscribe({
      next: (token: string) => {
        const cleanToken = token.replace(/^"|"$/g, '');
        console.log('Login token received:', cleanToken);
        localStorage.setItem('auth_token', cleanToken);
        this.router.navigate(['/users']);
      },
      error: (err : any) => {
        console.error('Login error response:', err);
        this.error =
          err?.error ||
          err?.message ||
          'Login failed. Please check your credentials and try again.';
      },
    });
  }
}
