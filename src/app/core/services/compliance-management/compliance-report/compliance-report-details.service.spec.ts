import { TestBed } from '@angular/core/testing';

import { ComplianceReportDetailsService } from './compliance-report-details.service';

describe('ComplianceReportDetailsService', () => {
  let service: ComplianceReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
