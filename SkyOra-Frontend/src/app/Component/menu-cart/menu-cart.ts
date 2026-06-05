import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuCartService } from '../../services/menu-cart.service';

@Component({
  selector: 'app-menu-cart',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-cart.html',
  styleUrl: './menu-cart.css',
})
export class MenuCart {
  private readonly menuCartService = inject(MenuCartService);
  private readonly router = inject(Router);

  readonly cartItems = this.menuCartService.cartItems;
  readonly subtotal = this.menuCartService.subtotal;
  readonly deliveryFee = this.menuCartService.deliveryFee;
  readonly discount = this.menuCartService.discount;

  readonly totalPayable = computed(() => {
    const total = this.subtotal() + this.deliveryFee() - this.discount();
    return total > 0 ? total : 0;
  });

  incrementQuantity(itemId: number): void {
    this.menuCartService.incrementQuantity(itemId);
  }

  decrementQuantity(itemId: number): void {
    this.menuCartService.decrementQuantity(itemId);
  }

  removeItem(itemId: number): void {
    this.menuCartService.removeItem(itemId);
  }

  checkout(): void {
    const amount = this.totalPayable();

    if (amount <= 0) {
      return;
    }

    this.router.navigate(['/payment'], {
      state: {
        checkoutType: 'menu',
        amount,
        cartItems: this.cartItems(),
        summary: {
          subtotal: this.subtotal(),
          deliveryFee: this.deliveryFee(),
          discount: this.discount(),
          totalPayable: amount
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/menu']);
  }
}
