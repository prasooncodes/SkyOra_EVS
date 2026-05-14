import { Component, Inject, PLATFORM_ID, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PassengerService } from '../../services/passengers';

@Component({
  selector: 'app-passenger-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './passenger-detail.html',
  styleUrl: './passenger-detail.css',
})
export class PassengerDetail implements OnInit {
  passengers: any[] = [];
  bookingId: number = 0;
  isLoading: boolean = true;

  // ✅ Injected missing utilities via modern functional inject wrappers
  private route = inject(ActivatedRoute);
  private passengerService = inject(PassengerService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  // 🔄 Changed hook from ngAfterViewInit to ngOnInit to stabilize change detection bindings
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ FIX: Route parameter is 'id' not 'bookingId' (see app.routes.ts: passengerdetails/:id)
      this.bookingId = Number(this.route.snapshot.paramMap.get('id')) || 0;
      if (this.bookingId > 0) {
        this.loadPassengerManifest();
      } else {
        this.isLoading = false;
      }
    }
  }

  loadPassengerManifest(): void {
    this.passengerService.getPassengersByBookingId(this.bookingId).subscribe({
      next: (data) => {
        // ✅ No timeout wrappers needed since data sets before the view finishes initial validation
        this.passengers = data;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error loading passenger manifest:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
