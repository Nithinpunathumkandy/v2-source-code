import { TestBed } from '@angular/core/testing';

import { IsmsRiskAssessmentService } from './isms-risk-assessment.service';

describe('IsmsRiskAssessmentService', () => {
  let service: IsmsRiskAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
