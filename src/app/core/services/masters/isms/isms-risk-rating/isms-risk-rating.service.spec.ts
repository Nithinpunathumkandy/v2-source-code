import { TestBed } from '@angular/core/testing';

import { IsmsRiskRatingService } from './isms-risk-rating.service';

describe('IsmsRiskRatingService', () => {
  let service: IsmsRiskRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
