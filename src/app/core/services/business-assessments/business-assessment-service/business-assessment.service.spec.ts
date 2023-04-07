import { TestBed } from '@angular/core/testing';

import { BusinessAssessmentService } from './business-assessment.service';

describe('BusinessAssessmentService', () => {
  let service: BusinessAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
