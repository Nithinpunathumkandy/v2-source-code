import { TestBed } from '@angular/core/testing';

import { ChangeRequestWorkflowService } from './change-request-workflow.service';

describe('ChangeRequestWorkflowService', () => {
  let service: ChangeRequestWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeRequestWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
