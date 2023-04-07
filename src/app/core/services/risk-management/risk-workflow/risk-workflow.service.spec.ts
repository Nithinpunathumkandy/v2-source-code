import { TestBed } from '@angular/core/testing';

import { RiskWorkflowService } from './risk-workflow.service';

describe('RiskWorkflowService', () => {
  let service: RiskWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
