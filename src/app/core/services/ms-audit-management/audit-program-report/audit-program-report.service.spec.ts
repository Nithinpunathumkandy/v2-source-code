import { TestBed } from '@angular/core/testing';

import { AuditProgramReportService } from './audit-program-report.service';

describe('AuditProgramReportService', () => {
  let service: AuditProgramReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditProgramReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
