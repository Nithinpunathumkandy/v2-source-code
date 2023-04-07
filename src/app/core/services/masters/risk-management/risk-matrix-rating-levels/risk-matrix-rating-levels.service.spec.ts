import { TestBed } from '@angular/core/testing';

import { RiskMatrixRatingLevelsService } from './risk-matrix-rating-levels.service';

describe('RiskMatrixRatingLevelsService', () => {
  let service: RiskMatrixRatingLevelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskMatrixRatingLevelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
