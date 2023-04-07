import { TestBed } from '@angular/core/testing';

import { IsmsRiskInfoWorkflowService } from './isms-risk-info-workflow.service';

describe('RiskInfoWorkflowService', () => {
  let service: IsmsRiskInfoWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskInfoWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
