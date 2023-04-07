import { TestBed } from '@angular/core/testing';

import { AmAuditSummaryService } from './am-audit-summary.service';

describe('AmAuditSummaryService', () => {
  let service: AmAuditSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
