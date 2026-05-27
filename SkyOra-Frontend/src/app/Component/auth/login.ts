import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { UserServices } from '../../services/user';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RecaptchaModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  captchaError = '';
  recaptchaToken = '';
  recaptchaSiteKey = '6Ld81_YsAAAAAEPiFnVCXhZvVyQ3Xrcl4ykaDRi6';

  constructor(
    private userService: UserServices,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.captchaError = '';

    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    if (!this.recaptchaToken) {
      this.captchaError = 'Please complete the captcha verification.';
      return;
    }

    const payload = { email: this.email, password: this.password, captchaToken: this.recaptchaToken };
    console.log('Login payload:', payload);

    this.userService.login(payload).subscribe({
      next: (token: string) => {
        const cleanToken = token.replace(/^"|"$/g, '');
        console.log('Login token received:', cleanToken);
        this.authService.setToken(cleanToken);
        this.router.navigate(['/home1']);
      },
      error: (err: any) => {
        console.error('Login error response:', err);
        this.router.navigate(['/error']);
      },
    });
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
