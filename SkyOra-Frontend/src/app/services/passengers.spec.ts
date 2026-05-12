import { TestBed } from '@angular/core/testing';

import { Passengers } from './passengers';

describe('Passengers', () => {
  let service: Passengers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Passengers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
