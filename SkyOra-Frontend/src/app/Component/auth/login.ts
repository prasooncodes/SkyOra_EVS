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
  captchaError = '';
  captchaQuestion = 'Type the characters shown below to verify you are human';
  captchaInput = '';
  captchaText = '';

  constructor(
    private userService: UserServices,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetCaptcha();
  }

  onSubmit() {
    this.error = '';
    this.captchaError = '';

    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    if (!this.validateCaptcha()) {
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
      error: (err: any) => {
        console.error('Login error response:', err);
        this.router.navigate(['/error']);
      },
    });
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
