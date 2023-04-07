import { TestBed } from '@angular/core/testing';

import { AmCsaAssessmentService } from './am-csa-assessment.service';

describe('AmCsaAssessmentService', () => {
  let service: AmCsaAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmCsaAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
