import { TestBed } from '@angular/core/testing';

import { AmDraftWorkflowService } from './am-draft-workflow.service';

describe('AmDraftWorkflowService', () => {
  let service: AmDraftWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmDraftWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
