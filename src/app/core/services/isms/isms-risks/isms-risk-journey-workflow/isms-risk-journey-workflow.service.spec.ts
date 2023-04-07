import { TestBed } from '@angular/core/testing';

import { IsmsRiskJourneyWorkflowService } from './isms-risk-journey-workflow.service';

describe('RiskJourneyWorkflowService', () => {
  let service: IsmsRiskJourneyWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskJourneyWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
