import { TestBed } from '@angular/core/testing';

import { AmAuditFindingCaService } from './am-audit-finding-ca.service';

describe('AmAuditFindingCaService', () => {
  let service: AmAuditFindingCaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditFindingCaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
