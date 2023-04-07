import { TestBed } from '@angular/core/testing';

import { MsAuditPlanObjectiveService } from './ms-audit-plan-objective.service';

describe('MsAuditPlanObjectiveService', () => {
  let service: MsAuditPlanObjectiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditPlanObjectiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
