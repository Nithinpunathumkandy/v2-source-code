import { TestBed } from '@angular/core/testing';

import { ObjectiveWorkflowService } from './objective-workflow.service';

describe('ObjectiveWorkflowService', () => {
  let service: ObjectiveWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectiveWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
