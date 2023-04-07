import { TestBed } from '@angular/core/testing';

import { IsmsRiskTreatmentService } from './isms-risk-treatment.service';

describe('IsmsRiskTreatmentService', () => {
  let service: IsmsRiskTreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskTreatmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
