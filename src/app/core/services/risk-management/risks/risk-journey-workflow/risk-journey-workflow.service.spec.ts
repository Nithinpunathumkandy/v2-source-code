import { TestBed } from '@angular/core/testing';

import { RiskJourneyWorkflowService } from './risk-journey-workflow.service';

describe('RiskJourneyWorkflowService', () => {
  let service: RiskJourneyWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskJourneyWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
