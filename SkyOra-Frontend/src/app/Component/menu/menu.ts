import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuCartService, MenuItem } from '../../services/menu-cart.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private readonly menuCartService = inject(MenuCartService);
  private readonly router = inject(Router);

  readonly cartCount = this.menuCartService.cartCount;

  readonly menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Skyora Blue Latte',
      price: 280,
      category: 'Cosmic Brews',
      description: 'Signature espresso infused with natural butterfly pea flower and vanilla syrup.',
      image: '/assets/blue_latte.jpg'
    },
    {
      id: 2,
      name: 'Stardust Croissant',
      price: 190,
      category: 'Galaxy Bites',
      description: 'Flaky, dark chocolate croissant topped with edible silver glitter dust.',
      image: '/assets/crosso.jpg'
    },
    {
      id: 3,
      name: 'Nebula Passion Iced Tea',
      price: 240,
      category: 'Cosmic Brews',
      description: 'Layered passionfruit tea with a splash of lemonade and a purple tint.',
      image: '/assets/cold_brew.webp'
    },
    {
      id: 4,
      name: 'Galaxy Velvet Cake',
      price: 320,
      category: 'Nebula Desserts',
      description: 'Rich red velvet cake layers coated in a cosmic mirror-glaze frosting.',
      image: '/assets/cake.jpg'
    },
    {
      id: 5,
      name: 'Meteor Mocha Crunch',
      price: 295,
      category: 'Cosmic Brews',
      description: 'Rich espresso mixed with dark chocolate and topped with honeycomb crunch rocks.',
      image: '/assets/mocha.jpg'
    },
    {
      id: 6,
      name: 'Asteroid Paneer Tikka Wrap',
      price: 260,
      category: 'Galaxy Bites',
      description: 'Smoky paneer cubes tossed in mint chutney and wrapped in a charcoal tortilla.',
      image: '/assets/panner_wrap.jpg'
    },
    {
      id: 7,
      name: 'Comet Caramel Frappe',
      price: 310,
      category: 'Cosmic Brews',
      description: 'Blended ice coffee loaded with whipped cream and a gold-leaf caramel drizzle spiral.',
      image: '/assets/caramel.jpg'
    },
    {
      id: 8,
      name: 'Solar Eclipse Sliders',
      price: 340,
      category: 'Galaxy Bites',
      description: 'Twin gourmet mini burgers featuring spicy veggie patties in jet-black brioche buns.',
      image: '/assets/slidder.jpg'
    },
    {
      id: 9,
      name: 'Makhani Pasta Fusion',
      price: 315,
      category: 'Galaxy Bites',
      description: 'Penne pasta tossed in a creamy, mildly spiced makhani gravy and topped with fresh mozzarella.',
      image: '/assets/pasta.jpg'
    },
    {
      id: 10,
      name: 'Supernova Loaded Fries',
      price: 230,
      category: 'Galaxy Bites',
      description: 'Crispy golden fries drenched in cheese sauce, peri-peri spice, and jalapenos.',
      image: '/assets/fries.jpg'
    },
    {
      id: 11,
      name: 'Dark Matter Cold Brew',
      price: 270,
      category: 'Cosmic Brews',
      description: '18-hour steep cold brew layered over crisp tonic water and finished with an orange twist.',
      image: '/assets/cold_brew.webp'
    },
    {
      id: 12,
      name: 'Infinite S\'mores Brownie',
      price: 210,
      category: 'Nebula Desserts',
      description: 'Fudgy dark chocolate brownie base topped with toasted, gooey marshmallows and graham cracker crumbs.',
      image: '/assets/brownie.webp'
    }
  ];

  addToCart(item: MenuItem): void {
    alert(`Added "${item.name}" to cart!`);
    this.menuCartService.addItem(item);
  }

  viewCart(): void {
    this.router.navigate(['/menu-cart']);
  }
}
