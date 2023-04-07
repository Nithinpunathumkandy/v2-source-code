import { TestBed } from '@angular/core/testing';

import { AmAuditPlanWorkflowService } from './am-audit-plan-workflow.service';

describe('AmAuditPlanWorkflowService', () => {
  let service: AmAuditPlanWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditPlanWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
