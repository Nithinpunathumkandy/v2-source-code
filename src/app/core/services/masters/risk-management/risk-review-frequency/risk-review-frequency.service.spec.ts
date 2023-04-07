import { TestBed } from '@angular/core/testing';

import { RiskReviewFrequencyService } from './risk-review-frequency.service';

describe('RiskReviewFrequencyService', () => {
  let service: RiskReviewFrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskReviewFrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
