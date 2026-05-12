import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNetwork } from './my-network';

describe('MyNetwork', () => {
  let component: MyNetwork;
  let fixture: ComponentFixture<MyNetwork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNetwork],
    }).compileComponents();

    fixture = TestBed.createComponent(MyNetwork);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
