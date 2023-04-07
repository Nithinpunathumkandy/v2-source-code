import { TestBed } from '@angular/core/testing';

import { AmAuditReportDetailsService } from './am-audit-report-details.service';

describe('AmAuditReportDetailsService', () => {
  let service: AmAuditReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
