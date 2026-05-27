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
  pagedFeedbacks: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
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
        this.totalPages = Math.max(1, Math.ceil(this.feedbacks.length / this.itemsPerPage));
        this.currentPage = 1;
        this.updatePagedFeedbacks();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load feedbacks', err);
        this.feedbacks = [];
      }
    });
  }

  private updatePagedFeedbacks(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedFeedbacks = this.feedbacks.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedFeedbacks();
  }

}
