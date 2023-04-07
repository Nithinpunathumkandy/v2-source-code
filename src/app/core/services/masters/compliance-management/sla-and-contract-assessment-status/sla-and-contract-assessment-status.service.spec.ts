import { TestBed } from '@angular/core/testing';

import { SlaAndContractAssessmentStatusService } from './sla-and-contract-assessment-status.service';

describe('SlaAndContractAssessmentStatusService', () => {
  let service: SlaAndContractAssessmentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaAndContractAssessmentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
