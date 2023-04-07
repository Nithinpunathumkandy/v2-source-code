import { TestBed } from '@angular/core/testing';

import { BcmRiskAssessmentService } from './bcm-risk-assessment.service';

describe('BcmRiskAssessmentService', () => {
  let service: BcmRiskAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmRiskAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
