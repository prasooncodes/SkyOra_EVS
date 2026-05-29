import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit, OnDestroy {
  isLoggedIn = false;
  role: string | null = null;
  user: AuthUser | null = null;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.authState$.subscribe((user) => {
        this.user = user;
        this.role = user?.role?.toString().toLowerCase() || null;
        this.isLoggedIn = !!user;
      })
    );
  }

  get displayName(): string {
    const name = this.user?.name?.trim();
    if (name) {
      return name;
    }

    const email = this.user?.email?.trim();
    if (email) {
      return email.split('@')[0];
    }

    return 'User';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  manageaccount():void {
    this.router.navigate(['/manageaccount']);
  }
  mytrips():void {
    this.router.navigate(['/bookingsbyid']);
  }
  managebookings():void {
    this.router.navigate(['/manage-bookings']);
  }
}
