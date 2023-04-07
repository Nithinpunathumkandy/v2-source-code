import { TestBed } from '@angular/core/testing';

import { HiraJourneyWorkflowService } from './hira-journey-workflow.service';

describe('HiraJourneyWorkflowService', () => {
  let service: HiraJourneyWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraJourneyWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
