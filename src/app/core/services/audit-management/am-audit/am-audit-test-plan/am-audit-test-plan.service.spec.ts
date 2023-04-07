import { TestBed } from '@angular/core/testing';

import { AmAuditTestPlanService } from './am-audit-test-plan.service';

describe('AmAuditTestPlanService', () => {
  let service: AmAuditTestPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditTestPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
