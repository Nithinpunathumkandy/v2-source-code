import { TestBed } from '@angular/core/testing';

import { ControlAssessmentActionPlanStatusService } from './control-assessment-action-plan-status.service';

describe('ControlAssessmentActionPlanStatusService', () => {
  let service: ControlAssessmentActionPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAssessmentActionPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
