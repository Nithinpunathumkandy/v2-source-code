import { TestBed } from '@angular/core/testing';

import { MsAuditFindingStatusService } from './ms-audit-finding-status.service';

describe('MsAuditFindingStatusService', () => {
  let service: MsAuditFindingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditFindingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
