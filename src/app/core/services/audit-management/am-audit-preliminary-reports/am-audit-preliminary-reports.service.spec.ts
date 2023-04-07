import { TestBed } from '@angular/core/testing';

import { AmAuditPreliminaryReportsService } from './am-audit-preliminary-reports.service';

describe('AmAuditPreliminaryReportsService', () => {
  let service: AmAuditPreliminaryReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditPreliminaryReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
