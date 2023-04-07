import { TestBed } from '@angular/core/testing';

import { StrategyObjectiveTypeService } from './strategy-objective-type.service';

describe('StrategyObjectiveTypeService', () => {
  let service: StrategyObjectiveTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyObjectiveTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
