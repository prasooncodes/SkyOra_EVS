import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inprogress } from './inprogress';

describe('Inprogress', () => {
  let component: Inprogress;
  let fixture: ComponentFixture<Inprogress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inprogress],
    }).compileComponents();

    fixture = TestBed.createComponent(Inprogress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
