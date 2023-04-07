import { TestBed } from '@angular/core/testing';

import { ContractAssessmentService } from './contract-assessment.service';

describe('ContractAssessmentService', () => {
  let service: ContractAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
