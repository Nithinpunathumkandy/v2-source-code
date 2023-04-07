import { TestBed } from '@angular/core/testing';

import { AmAnnualAuditPlanService } from './am-annual-audit-plan.service';

describe('AmAnnualAuditPlanService', () => {
  let service: AmAnnualAuditPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAnnualAuditPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
