import { TestBed } from '@angular/core/testing';

import { HiraWorkflowService } from './hira-workflow.service';

describe('HiraWorkflowService', () => {
  let service: HiraWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
