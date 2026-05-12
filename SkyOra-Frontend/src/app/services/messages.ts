import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'https://localhost:7169/api/Message';

  constructor(private http: HttpClient) {}

  submitMessage(msg: { Name: string; Email: string, Subject: string, Message: string }) {
    const payload = {
      Name: msg.Name,
      Email: msg.Email,
      Subject: msg.Subject,
      Message: msg.Message,
    };
    console.log('Message submitted:', payload);
    return this.http.post<any>(this.apiUrl, payload);
  }

  getMessages() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
