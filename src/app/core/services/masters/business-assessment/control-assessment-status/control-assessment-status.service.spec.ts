import { TestBed } from '@angular/core/testing';

import { ControlAssessmentStatusService } from './control-assessment-status.service';

describe('ControlAssessmentStatusService', () => {
  let service: ControlAssessmentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAssessmentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
