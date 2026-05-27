import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() {
    console.log('AnalyticsService initialized');
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const pageName = event.urlAfterRedirects || event.url;
        console.log('Analytics track page:', pageName);
        this.trackPageView(pageName);
      });
  }

  private trackPageView(pageName: string): void {
    const payload = {
      pageName,
      timestamp: new Date().toISOString(),
    };

    const analyticsUrl = 'https://localhost:7169/api/analytics/track';

    this.http
      .post(analyticsUrl, payload, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .subscribe({
        next: () => console.log('Analytics posted:', pageName),
        error: (err) => console.error('Analytics tracking failed:', err),
      });
  }
}
