import { TestBed } from '@angular/core/testing';

import { RiskScoreService } from './risk-score.service';

describe('RiskScoreService', () => {
  let service: RiskScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
