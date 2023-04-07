import { TestBed } from '@angular/core/testing';

import { AmAuditService } from './am-audit.service';

describe('AmAuditService', () => {
  let service: AmAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
