import { TestBed } from '@angular/core/testing';

import { IsmsRiskMatrixCalculationMethodService } from './isms-risk-matrix-calculation-method.service';

describe('IsmsRiskMatrixCalculationMethodService', () => {
  let service: IsmsRiskMatrixCalculationMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskMatrixCalculationMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
