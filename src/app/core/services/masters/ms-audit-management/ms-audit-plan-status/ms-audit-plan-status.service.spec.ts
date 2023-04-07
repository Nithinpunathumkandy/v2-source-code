import { TestBed } from '@angular/core/testing';

import { MsAuditPlanStatusService } from './ms-audit-plan-status.service';

describe('MsAuditPlanStatusService', () => {
  let service: MsAuditPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
