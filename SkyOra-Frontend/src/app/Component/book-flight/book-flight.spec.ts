import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BookFlight } from './book-flight';

describe('BookFlight', () => {
  let component: BookFlight;
  let fixture: ComponentFixture<BookFlight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFlight, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFlight);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
