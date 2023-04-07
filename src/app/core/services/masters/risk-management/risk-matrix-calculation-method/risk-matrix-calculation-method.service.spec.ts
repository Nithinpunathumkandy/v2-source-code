import { TestBed } from '@angular/core/testing';

import { RiskMatrixCalculationMethodService } from './risk-matrix-calculation-method.service';

describe('RiskMatrixCalculationMethodService', () => {
  let service: RiskMatrixCalculationMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskMatrixCalculationMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
