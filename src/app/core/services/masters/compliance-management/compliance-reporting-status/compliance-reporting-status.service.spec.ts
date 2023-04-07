import { TestBed } from '@angular/core/testing';

import { ComplianceReportingStatusService } from './compliance-reporting-status.service';

describe('ComplianceReportingStatusService', () => {
  let service: ComplianceReportingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceReportingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
