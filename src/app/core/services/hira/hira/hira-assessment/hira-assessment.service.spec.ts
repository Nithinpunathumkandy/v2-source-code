import { TestBed } from '@angular/core/testing';

import { HiraAssessmentService } from './hira-assessment.service';

describe('HiraAssessmentService', () => {
  let service: HiraAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
