import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBooking } from './manage-booking';

describe('ManageBooking', () => {
  let component: ManageBooking;
  let fixture: ComponentFixture<ManageBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBooking],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
