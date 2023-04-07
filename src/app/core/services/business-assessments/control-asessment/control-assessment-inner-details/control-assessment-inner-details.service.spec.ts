import { TestBed } from '@angular/core/testing';

import { ControlAssessmentInnerDetailsService } from './control-assessment-inner-details.service';

describe('ControlAssessmentInnerDetailsService', () => {
  let service: ControlAssessmentInnerDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAssessmentInnerDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
