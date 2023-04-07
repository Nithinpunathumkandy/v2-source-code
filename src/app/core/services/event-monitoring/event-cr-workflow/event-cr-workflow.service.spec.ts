import { TestBed } from '@angular/core/testing';

import { EventCrWorkflowService } from './event-cr-workflow.service';

describe('EventCrWorkflowService', () => {
  let service: EventCrWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventCrWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
