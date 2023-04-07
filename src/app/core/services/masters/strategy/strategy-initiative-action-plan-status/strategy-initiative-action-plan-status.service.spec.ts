import { TestBed } from '@angular/core/testing';

import { StrategyInitiativeActionPlanStatusService } from './strategy-initiative-action-plan-status.service';

describe('StrategyInitiativeActionPlanStatusService', () => {
  let service: StrategyInitiativeActionPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyInitiativeActionPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
