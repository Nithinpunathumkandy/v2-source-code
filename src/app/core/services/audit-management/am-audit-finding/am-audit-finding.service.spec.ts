import { TestBed } from '@angular/core/testing';

import { AmAuditFindingService } from './am-audit-finding.service';

describe('AmAuditFindingService', () => {
  let service: AmAuditFindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditFindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
