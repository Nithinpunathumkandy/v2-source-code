import { TestBed } from '@angular/core/testing';

import { AuditReportStatusesService } from './audit-report-statuses.service';

describe('AuditReportStatusesService', () => {
  let service: AuditReportStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditReportStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
