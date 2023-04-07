import { TestBed } from '@angular/core/testing';

import { AmAuditFindingIaService } from './am-audit-finding-ia.service';

describe('AmAuditFindingIaService', () => {
  let service: AmAuditFindingIaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditFindingIaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
