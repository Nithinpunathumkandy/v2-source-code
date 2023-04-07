import { TestBed } from '@angular/core/testing';

import { ActionPlanWorkflowService } from './action-plan-workflow.service';

describe('ActionPlanWorkflowService', () => {
  let service: ActionPlanWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionPlanWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
