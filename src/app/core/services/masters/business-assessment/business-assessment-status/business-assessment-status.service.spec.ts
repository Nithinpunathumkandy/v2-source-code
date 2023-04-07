import { TestBed } from '@angular/core/testing';

import { BusinessAssessmentStatusService } from './business-assessment-status.service';

describe('BusinessAssessmentStatusService', () => {
  let service: BusinessAssessmentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessAssessmentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
