import { computed, Injectable, signal } from '@angular/core';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuCartService {
  private readonly cartItemsState = signal<CartItem[]>([]);

  readonly cartItems = this.cartItemsState.asReadonly();
  readonly cartCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));
  readonly subtotal = computed(() => this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0));
  readonly deliveryFee = signal(40);
  readonly discount = signal(0);

  addItem(item: MenuItem): void {
    this.cartItemsState.update((items) => {
      const existingItem = items.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return items.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }

      return [...items, { ...item, quantity: 1 }];
    });
  }

  incrementQuantity(itemId: number): void {
    this.cartItemsState.update((items) =>
      items.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
    );
  }

  decrementQuantity(itemId: number): void {
    this.cartItemsState.update((items) =>
      items
        .map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  removeItem(itemId: number): void {
    this.cartItemsState.update((items) => items.filter((item) => item.id !== itemId));
  }

  clearCart(): void {
    this.cartItemsState.set([]);
  }
}