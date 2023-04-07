import { TestBed } from '@angular/core/testing';

import { AmAuditUniverseService } from './am-audit-universe.service';

describe('AmAuditUniverseService', () => {
  let service: AmAuditUniverseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditUniverseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
