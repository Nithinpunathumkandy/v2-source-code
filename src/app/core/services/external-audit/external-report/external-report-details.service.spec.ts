import { TestBed } from '@angular/core/testing';

import { ExternalReportDetailsService } from './external-report-details.service';

describe('ExternalReportDetailsService', () => {
  let service: ExternalReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
