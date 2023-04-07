import { TestBed } from '@angular/core/testing';

import { AmPreliminaryWorkflowService } from './am-preliminary-workflow.service';

describe('AmPreliminaryWorkflowService', () => {
  let service: AmPreliminaryWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmPreliminaryWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
