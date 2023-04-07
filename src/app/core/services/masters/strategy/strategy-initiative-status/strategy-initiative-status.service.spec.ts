import { TestBed } from '@angular/core/testing';

import { StrategyInitiativeStatusService } from './strategy-initiative-status.service';

describe('StrategyInitiativeStatusService', () => {
  let service: StrategyInitiativeStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyInitiativeStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
