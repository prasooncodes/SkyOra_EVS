import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = 'https://localhost:7169/api/Feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: { UserName: string; Comments: string }) {
    const payload = {
      UserName: feedback.UserName,
      Comments: feedback.Comments,
    };
    console.log('Feedback submitted:', payload);
    return this.http.post<any>(this.apiUrl, payload);
  }

  getFeedbacks() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
