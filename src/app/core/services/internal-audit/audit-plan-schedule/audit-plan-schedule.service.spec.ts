import { TestBed } from '@angular/core/testing';

import { AuditPlanScheduleService } from './audit-plan-schedule.service';

describe('AuditPlanScheduleService', () => {
  let service: AuditPlanScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPlanScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
