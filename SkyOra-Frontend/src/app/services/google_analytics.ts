import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var gtag: Function; // Declare the global gtag function

@Injectable({ providedIn: 'root' })
export class AnalyticsGoogleService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // ✈️ Track Page Views
  trackPageview(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      gtag('config', 'G-SQ4FSX9D4V', { 'page_path': url });
    }
  }

  // ✈️ Track Custom Events (Search, Bookings, etc.)
  trackEvent(eventName: string, params: any) {
    if (isPlatformBrowser(this.platformId)) {
      gtag('event', eventName, params);
    }
  }
}
