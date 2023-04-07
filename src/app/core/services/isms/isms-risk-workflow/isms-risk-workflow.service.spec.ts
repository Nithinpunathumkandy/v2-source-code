import { TestBed } from '@angular/core/testing';

import { IsmsRiskWorkflowService } from './isms-risk-workflow.service';

describe('IsmsRiskWorkflowService', () => {
  let service: IsmsRiskWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
