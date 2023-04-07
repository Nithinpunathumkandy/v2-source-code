import { TestBed } from '@angular/core/testing';

import { StrategyInitiativeActionsService } from './strategy-initiative-actions.service';

describe('StrategyInitiativeActionsService', () => {
  let service: StrategyInitiativeActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyInitiativeActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
