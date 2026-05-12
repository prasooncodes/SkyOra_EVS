import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface AuthUser {
  id: number;
  email: string | null;
  role: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthUser | null>(null);
  authState$ = this.authStateSubject.asObservable();
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    this.refreshAuthState();

    if (this.isBrowser) {
      window.addEventListener('storage', () => this.refreshAuthState());
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem('auth_token');
  }

  setToken(token: string | null): void {
    if (!this.isBrowser) {
      return;
    }

    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
    this.refreshAuthState();
  }

  logout(): void {
    this.setToken(null);
  }

  decodeJwt(token: string): any {
    try {
      let payload = token.split('.')[1] || '';
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      while (payload.length % 4 !== 0) {
        payload += '=';
      }
      const jsonPayload = atob(payload);
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  getCurrentUser(): AuthUser | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded = this.decodeJwt(token);
    if (!decoded) {
      return null;
    }

    return {
      id: Number(decoded.Myapp_User_Id || decoded.sub || 0),
      email:
        decoded.email ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email'] ||
        null,
      role:
        decoded.role ||
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        null,
    };
  }

  refreshAuthState(): void {
    this.authStateSubject.next(this.getCurrentUser());
  }

  getUserId(): number {
    return this.getCurrentUser()?.id || 0;
  }

  isLoggedIn(): boolean {
    return this.getUserId() > 0;
  }
}
