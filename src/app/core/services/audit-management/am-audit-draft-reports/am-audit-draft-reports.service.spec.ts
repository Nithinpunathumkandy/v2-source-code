import { TestBed } from '@angular/core/testing';

import { AmAuditDraftReportsService } from './am-audit-draft-reports.service';

describe('AmAuditDraftReportsService', () => {
  let service: AmAuditDraftReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditDraftReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
