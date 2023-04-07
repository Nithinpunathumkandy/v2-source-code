import { TestBed } from '@angular/core/testing';

import { ControlAssessmentActionPlanService } from './control-assessment-action-plan.service';

describe('ControlAssessmentActionPlanService', () => {
  let service: ControlAssessmentActionPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAssessmentActionPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
