import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = 'https://localhost:7169/api/User';
  private authUrl = 'https://localhost:7169/api/Auth';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  login(credentials: { email: string; password: string }) {
    const payload = {
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.password,
    };

    return this.http.post(`${this.authUrl}/Login`, payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as const,
    });
  }

  register(user: { name: string; age: number; gender: string; role?: string; email: string; password: string }) {
    const payload = {
      Name: user.name,
      Age: user.age,
      Gender: user.gender,
      Role: user.role || 'User',
      Email: user.email,
      PasswordHash: user.password,
    };

    return this.http.post<any>(this.apiUrl, payload);
  }
}
