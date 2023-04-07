import { TestBed } from '@angular/core/testing';

import { BusinessAssessmentFrequenciesService } from './business-assessment-frequencies.service';

describe('BusinessAssessmentFrequenciesService', () => {
  let service: BusinessAssessmentFrequenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessAssessmentFrequenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
