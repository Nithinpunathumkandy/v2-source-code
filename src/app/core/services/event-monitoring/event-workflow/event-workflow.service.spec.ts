import { TestBed } from '@angular/core/testing';

import { EventWorkflowService } from './event-workflow.service';

describe('EventWorkflowService', () => {
  let service: EventWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
