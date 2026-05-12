import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { FeedbackService } from '../../services/feedback';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css'],
})
export class Feedback {
  username = '';
  comments = '';
  message = '';
  submitted = false;
  feedbacks: any[] = [];
  loading = false;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

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
          this.username = '';
          this.comments = '';
          this.submitted = true;
          this.loadFeedbacks();
        },
        error: (err) => {
          console.error('Feedback submission failed:', err);
          this.message = 'Unable to submit feedback. Please try again later.';
        },
      });
  }

  private loadFeedbacks(): void {
    this.loading = true;
    this.feedbackService.getFeedbacks().subscribe({
      next: (items) => {
        this.feedbacks = items || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load feedbacks', err);
        this.feedbacks = [];
        this.loading = false;
      },
    });
  }
}
