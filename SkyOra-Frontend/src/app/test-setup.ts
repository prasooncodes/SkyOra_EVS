import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

console.log('[TEST SETUP] loaded');

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {},
            data: {},
            paramMap: {
              get: () => null,
            },
            queryParamMap: {
              get: () => null,
            },
          },
          params: of({}),
          queryParams: of({}),
          data: of({}),
          url: of([]),
        },
      },
    ],
  });
});
