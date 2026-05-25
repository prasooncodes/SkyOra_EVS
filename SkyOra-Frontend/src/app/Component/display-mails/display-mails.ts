import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MessageService } from '../../services/messages';

@Component({
  selector: 'app-display-mails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-mails.html',
  styleUrls: ['./display-mails.css'],
})
export class DisplayMails implements OnInit {

  messages: any[] = [];
  pagedMessages: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  private cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadMessages();
    }
  }

  loadMessages() {
    this.messageService.getMessages().subscribe({
      next: (data: any[]) => {
        this.messages = data || [];
        this.totalPages = Math.max(1, Math.ceil(this.messages.length / this.itemsPerPage));
        this.currentPage = 1;
        this.updatePagedMessages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.messages = [];
      }
    });
  }

  private updatePagedMessages(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedMessages = this.messages.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedMessages();
  }
}
