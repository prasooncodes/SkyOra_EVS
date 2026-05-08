import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAdd } from './flight-add';

describe('FlightAdd', () => {
  let component: FlightAdd;
  let fixture: ComponentFixture<FlightAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
