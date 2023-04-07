import { TestBed } from '@angular/core/testing';

import { AmAuditFinalReportsService } from './am-audit-final-reports.service';

describe('AmAuditFinalReportsService', () => {
  let service: AmAuditFinalReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditFinalReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
