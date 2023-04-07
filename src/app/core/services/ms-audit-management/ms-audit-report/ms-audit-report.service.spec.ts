import { TestBed } from '@angular/core/testing';

import { MsAuditReportService } from './ms-audit-report.service';

describe('MsAuditReportService', () => {
  let service: MsAuditReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
