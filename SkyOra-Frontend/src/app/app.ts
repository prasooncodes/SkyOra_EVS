import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./Component/navbar/navbar";
import { AnalyticsService } from './services/analytics';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SkyOra-Frontend');
  private readonly analyticsService = inject(AnalyticsService);
}
