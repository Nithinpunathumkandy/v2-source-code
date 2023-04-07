import { TestBed } from '@angular/core/testing';

import { StrategyReviewService } from './strategy-review.service';

describe('StrategyReviewService', () => {
  let service: StrategyReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
