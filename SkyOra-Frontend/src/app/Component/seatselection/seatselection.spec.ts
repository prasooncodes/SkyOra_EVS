import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seatselection } from './seatselection';

describe('Seatselection', () => {
  let component: Seatselection;
  let fixture: ComponentFixture<Seatselection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seatselection],
    }).compileComponents();

    fixture = TestBed.createComponent(Seatselection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
