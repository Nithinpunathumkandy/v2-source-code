import { TestBed } from '@angular/core/testing';

import { HiraScoreService } from './hira-score.service';

describe('HiraScoreService', () => {
  let service: HiraScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
