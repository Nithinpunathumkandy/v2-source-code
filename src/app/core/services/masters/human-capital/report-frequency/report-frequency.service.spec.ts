import { TestBed } from '@angular/core/testing';

import { ReportFrequencyService } from './report-frequency.service';

describe('ReportFrequencyService', () => {
  let service: ReportFrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportFrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
