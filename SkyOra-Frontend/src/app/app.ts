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
import { AnalyticsGoogleService } from './services/google_analytics';
import { Navbar } from './Component/navbar/navbar';
import { AnalyticsService } from './services/analytics';
import { ChatWidgetComponent } from "./Component/chat-widget/chat-widget";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ChatWidgetComponent],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>
  <app-chat-widget></app-chat-widget>
`, // This renders your whole app
})
export class App {
  protected readonly title = signal('SkyOra-Frontend');
  private readonly analyticsService = inject(AnalyticsService);
}
