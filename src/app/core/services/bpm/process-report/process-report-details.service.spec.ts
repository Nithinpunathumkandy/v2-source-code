import { TestBed } from '@angular/core/testing';

import { ProcessReportDetailsService } from './process-report-details.service';

describe('ProcessReportDetailsService', () => {
  let service: ProcessReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
