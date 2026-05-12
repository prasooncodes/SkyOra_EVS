import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingByID } from './booking-by-id';

describe('BookingByID', () => {
  let component: BookingByID;
  let fixture: ComponentFixture<BookingByID>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingByID],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingByID);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
