import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFeedback } from './display-feedback';

describe('DisplayFeedback', () => {
  let component: DisplayFeedback;
  let fixture: ComponentFixture<DisplayFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayFeedback],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayFeedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
