import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { FeedbackService } from '../../services/feedback';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  username = '';
  comments = '';
  message = '';
  submitted = false;

  constructor(private feedbackService: FeedbackService) {}

  submit() {
    if (!this.username.trim() || !this.comments.trim()) {
      this.message = 'Please enter both username and comments.';
      return;
    }

    this.message = '';
    this.submitted = true; // Show thank you immediately

    // Submit feedback asynchronously without blocking UI
    this.feedbackService
      .submitFeedback({ UserName: this.username, Comments: this.comments })
      .pipe(timeout(10000))
      .subscribe({
        next: () => {
          console.log('Feedback submitted successfully');
        },
        error: (err) => {
          console.error('Feedback submission failed:', err);
        },
      });
  }
}
