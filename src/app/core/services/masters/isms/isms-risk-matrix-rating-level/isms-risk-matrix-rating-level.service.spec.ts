import { TestBed } from '@angular/core/testing';

import { IsmsRiskMatrixRatingLevelService } from './isms-risk-matrix-rating-level.service';

describe('IsmsRiskMatrixRatingLevelService', () => {
  let service: IsmsRiskMatrixRatingLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskMatrixRatingLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
