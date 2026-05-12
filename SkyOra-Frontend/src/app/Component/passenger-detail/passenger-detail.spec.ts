import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerDetail } from './passenger-detail';

describe('PassengerDetail', () => {
  let component: PassengerDetail;
  let fixture: ComponentFixture<PassengerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
