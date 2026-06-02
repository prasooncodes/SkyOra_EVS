import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiurl = 'https://localhost:7169/api/Chat/send'; // Update port if your project profile shifted

  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: ChatMessage[]): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(this.apiurl, {
      Message: message,
      ChatHistory: history.map(h => ({ Role: h.role, Content: h.content }))
    });
  }
}
