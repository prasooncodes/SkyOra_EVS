<<<<<<< HEAD
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


import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from './services/google_analytics';
import { Navbar } from './Component/navbar/navbar';
=======
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./Component/navbar/navbar";
import { AnalyticsService } from './services/analytics';
>>>>>>> cc5786bdb58674bac3bc54da713b60a160c45eb4

@Component({
  standalone: true,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>`, // This renders your whole app
})
export class App {
<<<<<<< HEAD
  constructor(
    private router: Router, 
    private analytics: AnalyticsService
  ) {
    const platformId = inject(PLATFORM_ID);

    // ✅ Track every page view automatically
    if (isPlatformBrowser(platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.analytics.trackPageview(event.urlAfterRedirects);
      });
    }
  }
=======
  protected readonly title = signal('SkyOra-Frontend');
  private readonly analyticsService = inject(AnalyticsService);
>>>>>>> cc5786bdb58674bac3bc54da713b60a160c45eb4
}
