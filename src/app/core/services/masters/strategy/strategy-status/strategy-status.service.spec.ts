import { TestBed } from '@angular/core/testing';

import { StrategyStatusService } from './strategy-status.service';

describe('StrategyStatusService', () => {
  let service: StrategyStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
