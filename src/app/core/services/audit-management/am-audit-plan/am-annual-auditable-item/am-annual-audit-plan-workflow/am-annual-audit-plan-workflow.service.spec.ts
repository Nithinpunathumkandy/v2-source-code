import { TestBed } from '@angular/core/testing';

import { AmAnnualAuditPlanWorkflowService } from './am-annual-audit-plan-workflow.service';

describe('AmAnnualAuditPlanWorkflowService', () => {
  let service: AmAnnualAuditPlanWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAnnualAuditPlanWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
