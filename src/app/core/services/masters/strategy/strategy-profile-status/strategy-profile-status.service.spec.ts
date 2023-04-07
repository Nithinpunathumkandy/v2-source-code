import { TestBed } from '@angular/core/testing';

import { StrategyProfileStatusService } from './strategy-profile-status.service';

describe('StrategyProfileStatusService', () => {
  let service: StrategyProfileStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyProfileStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
