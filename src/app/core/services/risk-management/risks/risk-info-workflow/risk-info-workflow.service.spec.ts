import { TestBed } from '@angular/core/testing';

import { RiskInfoWorkflowService } from './risk-info-workflow.service';

describe('RiskInfoWorkflowService', () => {
  let service: RiskInfoWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskInfoWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
