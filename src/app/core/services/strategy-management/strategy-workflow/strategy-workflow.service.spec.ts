import { TestBed } from '@angular/core/testing';

import { StrategyWorkflowService } from './strategy-workflow.service';

describe('StrategyWorkflowService', () => {
  let service: StrategyWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
