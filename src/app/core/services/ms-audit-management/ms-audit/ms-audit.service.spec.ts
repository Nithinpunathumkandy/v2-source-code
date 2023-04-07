import { TestBed } from '@angular/core/testing';

import { MsAuditService } from './ms-audit.service';

describe('MsAuditService', () => {
  let service: MsAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
