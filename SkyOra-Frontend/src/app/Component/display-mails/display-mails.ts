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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.messages = [];
      }
    });
  }
}
