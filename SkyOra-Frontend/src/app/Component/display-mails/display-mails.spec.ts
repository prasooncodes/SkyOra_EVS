import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMails } from './display-mails';

describe('DisplayMails', () => {
  let component: DisplayMails;
  let fixture: ComponentFixture<DisplayMails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayMails],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayMails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
