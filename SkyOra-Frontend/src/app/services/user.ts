import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserServices {
  private apiUrl = 'https://localhost:7169/api/User';
  private authUrl = 'https://localhost:7169/api/Auth';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

 editUser(
  id: number, 
  user: { 
    name: string; 
    age: number; 
    gender: string; 
    role: string; 
    email: string; 
    password?: string; // Optional field in case they do not wish to update their password
  }
) {
  const payload = {
    Name: user.name,
    Age: user.age,
    Gender: user.gender,
    Role: user.role,
    Email: user.email,
    ...(user.password && { PasswordHash: user.password }) // Keep the password field consistent with registration/login
  };

  return this.http.put(`${this.apiUrl}/${id}`, payload);
}


  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
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

  register(user: { name: string; age: number; gender: string; role?: string; email: string; password: string; captchaToken?: string }) {
    const payload: any = {
      Name: user.name,
      Age: user.age,
      Gender: user.gender,
      Role: user.role || 'User',
      Email: user.email,
      PasswordHash: user.password,
    };

    if (user.captchaToken) {
      payload.captchaToken = user.captchaToken;
    }

    return this.http.post<any>(this.apiUrl, payload);
  }
}
