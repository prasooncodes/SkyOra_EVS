import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCart } from './menu-cart';

describe('MenuCart', () => {
  let component: MenuCart;
  let fixture: ComponentFixture<MenuCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCart],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
