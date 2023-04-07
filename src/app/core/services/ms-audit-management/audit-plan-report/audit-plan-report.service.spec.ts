import { TestBed } from '@angular/core/testing';

import { AuditPlanReportService } from './audit-plan-report.service';

describe('AuditPlanReportService', () => {
  let service: AuditPlanReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPlanReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
