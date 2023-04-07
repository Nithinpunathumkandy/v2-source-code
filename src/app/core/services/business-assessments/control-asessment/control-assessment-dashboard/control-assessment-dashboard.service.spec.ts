import { TestBed } from '@angular/core/testing';

import { ControlAssessmentDashboardService } from './control-assessment-dashboard.service';

describe('ControlAssessmentDashboardService', () => {
  let service: ControlAssessmentDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAssessmentDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
