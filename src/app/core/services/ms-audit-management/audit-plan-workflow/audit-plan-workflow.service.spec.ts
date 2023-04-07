import { TestBed } from '@angular/core/testing';

import { AuditPlanWorkflowService } from './audit-plan-workflow.service';

describe('AuditPlanWorkflowService', () => {
  let service: AuditPlanWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPlanWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
