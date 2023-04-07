import { TestBed } from '@angular/core/testing';

import { AuditNonConfirmityService } from './audit-non-confirmity.service';

describe('AuditNonConfirmityService', () => {
  let service: AuditNonConfirmityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditNonConfirmityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
