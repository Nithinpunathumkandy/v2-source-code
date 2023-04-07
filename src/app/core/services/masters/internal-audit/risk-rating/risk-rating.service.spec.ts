import { TestBed } from '@angular/core/testing';

import { RiskRatingService } from './risk-rating.service';

describe('RiskRatingService', () => {
  let service: RiskRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
