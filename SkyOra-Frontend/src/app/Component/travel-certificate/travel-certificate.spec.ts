import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelCertificate } from './travel-certificate';

describe('TravelCertificate', () => {
  let component: TravelCertificate;
  let fixture: ComponentFixture<TravelCertificate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelCertificate],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelCertificate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
