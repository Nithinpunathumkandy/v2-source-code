import { TestBed } from '@angular/core/testing';

import { AmAuditPlanService } from './am-audit-plan.service';

describe('AmAuditPlanService', () => {
  let service: AmAuditPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
