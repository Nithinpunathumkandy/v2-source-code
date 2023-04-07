import { TestBed } from '@angular/core/testing';

import { StrategyReportsService } from './strategy-reports.service';

describe('StrategyReportsService', () => {
  let service: StrategyReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
