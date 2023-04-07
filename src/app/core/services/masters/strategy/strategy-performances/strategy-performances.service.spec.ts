import { TestBed } from '@angular/core/testing';

import { StrategyPerformancesService } from './strategy-performances.service';

describe('StrategyPerformancesService', () => {
  let service: StrategyPerformancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyPerformancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
