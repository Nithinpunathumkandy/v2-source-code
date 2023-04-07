import { TestBed } from '@angular/core/testing';

import { StrategyInitiativeMilestoneStatusService } from './strategy-initiative-milestone-status.service';

describe('StrategyInitiativeMilestoneStatusService', () => {
  let service: StrategyInitiativeMilestoneStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyInitiativeMilestoneStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
