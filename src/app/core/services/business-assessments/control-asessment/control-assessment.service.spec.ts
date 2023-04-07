import { TestBed } from '@angular/core/testing';

import { ControlAssessmentService } from './control-assessment.service';

describe('ControlAssessmentService', () => {
  let service: ControlAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
