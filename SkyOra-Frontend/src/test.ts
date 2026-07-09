import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

@Component({
  selector: 'app-empty-route-stub',
  template: ''
})
class EmptyRouteStubComponent {}

const noop = (): any => undefined;

Object.defineProperty(globalThis, 'alert', {
  configurable: true,
  writable: true,
  value: noop,
});
Object.defineProperty(globalThis, 'confirm', {
  configurable: true,
  writable: true,
  value: () => true,
});
Object.defineProperty(globalThis, 'prompt', {
  configurable: true,
  writable: true,
  value: () => null,
});

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule.withRoutes([
        { path: '**', component: EmptyRouteStubComponent }
      ]),
      HttpClientTestingModule,
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {},
            data: {},
            paramMap: { get: () => null },
            queryParamMap: { get: () => null },
          },
          params: of({}),
          queryParams: of({}),
          data: of({}),
          url: of([]),
          fragment: of(null),
        },
      },
    ],
  });
});

afterEach(() => {
  TestBed.resetTestingModule();
});
