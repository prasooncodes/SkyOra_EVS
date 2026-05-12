import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserServices } from '../../services/user';
import { AuthService } from '../../services/auth-service';

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

  constructor(
    private userService: UserServices,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    const payload = { email: this.email, password: this.password };
    console.log('Login payload:', payload);

    this.userService.login(payload).subscribe({
      next: (token: string) => {
        const cleanToken = token.replace(/^"|"$/g, '');
        console.log('Login token received:', cleanToken);
        this.authService.setToken(cleanToken);
        this.router.navigate(['/home1']);
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
