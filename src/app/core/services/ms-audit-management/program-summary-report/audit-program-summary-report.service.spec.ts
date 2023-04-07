import { TestBed } from '@angular/core/testing';

import { AuditProgramSummaryReportService } from './audit-program-summary-report.service';

describe('AuditProgramSummaryReportService', () => {
  let service: AuditProgramSummaryReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditProgramSummaryReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
