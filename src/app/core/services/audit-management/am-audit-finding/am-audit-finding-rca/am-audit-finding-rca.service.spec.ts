import { TestBed } from '@angular/core/testing';

import { AmAuditFindingRcaService } from './am-audit-finding-rca.service';

describe('AmAuditFindingRcaService', () => {
  let service: AmAuditFindingRcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditFindingRcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
