import { TestBed } from '@angular/core/testing';

import { BcmRiskTreatmentService } from './bcm-risk-treatment.service';

describe('BcmRiskTreatmentService', () => {
  let service: BcmRiskTreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmRiskTreatmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
