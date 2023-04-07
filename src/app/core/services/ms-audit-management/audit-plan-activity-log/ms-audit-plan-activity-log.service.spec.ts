import { TestBed } from '@angular/core/testing';

import { MsAuditPlanActivityLogService } from './ms-audit-plan-activity-log.service';

describe('MsAuditPlanActivityLogService', () => {
  let service: MsAuditPlanActivityLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditPlanActivityLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
