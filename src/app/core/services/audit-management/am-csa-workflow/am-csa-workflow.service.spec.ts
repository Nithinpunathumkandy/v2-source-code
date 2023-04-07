import { TestBed } from '@angular/core/testing';

import { AmCSAWorkflowService } from './am-csa-workflow.service';

describe('AmCSAWorkflowService', () => {
  let service: AmCSAWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmCSAWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
