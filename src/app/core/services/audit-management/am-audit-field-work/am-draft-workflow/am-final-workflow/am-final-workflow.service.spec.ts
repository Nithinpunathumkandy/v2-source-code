import { TestBed } from '@angular/core/testing';

import { AmFinalWorkflowService } from './am-final-workflow.service';

describe('AmFinalWorkflowService', () => {
  let service: AmFinalWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmFinalWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
