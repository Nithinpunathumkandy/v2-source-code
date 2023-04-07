import { TestBed } from '@angular/core/testing';

import { ByYearService } from './by-year.service';

describe('ByYearService', () => {
  let service: ByYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
