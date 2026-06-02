// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { Navbar } from "./Component/navbar/navbar";

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, Navbar],
//   templateUrl: './app.html',
//   styleUrl: './app.css',
// })
// export class App {
//   protected readonly title = signal('SkyOra-Frontend');
// }

import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './Component/navbar/navbar';
import { ChatWidgetComponent } from './Component/chat-widget/chat-widget';
import { AnalyticsService } from './services/analytics';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ChatWidgetComponent],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>
  <app-chat-widget></app-chat-widget>
`,
})
export class App {
  private readonly analyticsService = inject(AnalyticsService);

  constructor(
    private router: Router,
    private analytics: AnalyticsService
  ) {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        //this.analytics.trackPageview(event.urlAfterRedirects);
      });
    }
  }

  protected readonly title = signal('SkyOra-Frontend');
}
