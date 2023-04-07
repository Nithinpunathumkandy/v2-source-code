import { TestBed } from '@angular/core/testing';

import { AuditReportDetailsService } from './audit-report-details.service';

describe('AuditReportDetailsService', () => {
  let service: AuditReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
