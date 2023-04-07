import { TestBed } from '@angular/core/testing';

import { AmWorkflowService } from './am-workflow.service';

describe('AmWorkflowService', () => {
  let service: AmWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
