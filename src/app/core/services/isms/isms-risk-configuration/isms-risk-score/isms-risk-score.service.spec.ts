import { TestBed } from '@angular/core/testing';

import { IsmsRiskScoreService } from './isms-risk-score.service';

describe('IsmsRiskScoreService', () => {
  let service: IsmsRiskScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
