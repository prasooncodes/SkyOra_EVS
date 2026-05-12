import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FeedbackService } from '../../services/feedback';

@Component({
  selector: 'app-display-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-feedback.html',
  styleUrls: ['./display-feedback.css'],
})
export class DisplayFeedback implements OnInit {

  feedbacks: any[] = [];
  private cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadFeedbacks();
    }
  }

  loadFeedbacks() {
    this.feedbackService.getFeedbacks().subscribe({
      next: (data: any[]) => {
        this.feedbacks = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load feedbacks', err);
        this.feedbacks = [];
      }
    });
  }

}
