import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css'
})
export class ChatWidgetComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = false;
  hasNewMessage = false;
  isTyping = false;
  userPrompt = '';
  chatMessages: ChatMessage[] = [];

  private chatService = inject(ChatService);

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasNewMessage = false;
      this.scrollToBottom();
    }
  }

  dispatchPrompt() {
    if (!this.userPrompt.trim() || this.isTyping) return;

    const userMessageContent = this.userPrompt.trim();
    this.chatMessages.push({ role: 'user', content: userMessageContent });
    this.userPrompt = '';
    this.isTyping = true;
    this.scrollToBottom();

    this.chatService.sendMessage(userMessageContent, this.chatMessages.slice(0, -1)).subscribe({
      next: (response) => {
        this.chatMessages.push({ role: 'assistant', content: response.reply });
        this.isTyping = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Chat AI failure:', err);
        const detail = err?.error?.detail || err?.message || 'Please retry.';
        this.chatMessages.push({ role: 'assistant', content: `Apologies, my system routing encountered turbulence. ${detail}` });
        this.isTyping = false;
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }, 50);
  }
}
