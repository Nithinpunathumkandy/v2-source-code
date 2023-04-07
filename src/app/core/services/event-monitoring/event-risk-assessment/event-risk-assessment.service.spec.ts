import { TestBed } from '@angular/core/testing';

import { EventRiskAssessmentService } from './event-risk-assessment.service';

describe('EventRiskAssessmentService', () => {
  let service: EventRiskAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRiskAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
