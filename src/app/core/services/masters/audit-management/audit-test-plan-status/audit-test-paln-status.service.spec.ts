import { TestBed } from '@angular/core/testing';

import { AuditTestPalnStatusService } from './audit-test-paln-status.service';

describe('AuditTestPalnStatusService', () => {
  let service: AuditTestPalnStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditTestPalnStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
