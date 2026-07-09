import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PaymentGateway } from './payment-gateway';

describe('PaymentGateway', () => {
  let component: PaymentGateway;
  let fixture: ComponentFixture<PaymentGateway>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentGateway, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentGateway);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
