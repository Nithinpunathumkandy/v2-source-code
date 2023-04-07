import { TestBed } from '@angular/core/testing';

import { RiskTreatmentService } from './risk-treatment.service';

describe('RiskTreatmentService', () => {
  let service: RiskTreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskTreatmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
