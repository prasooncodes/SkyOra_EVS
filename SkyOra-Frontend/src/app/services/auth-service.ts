import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('auth_token');
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

  getCurrentUser() {
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
      email: decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email"] || null,
      role: decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null,
    };
  }

  getUserId(): number {
    return this.getCurrentUser()?.id || 0;
  }

  isLoggedIn(): boolean {
    return this.getUserId() > 0;
  }
}
