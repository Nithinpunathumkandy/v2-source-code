import { TestBed } from '@angular/core/testing';

import { AnnualSummaryService } from './annual-summary.service';

describe('AnnualSummaryService', () => {
  let service: AnnualSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
