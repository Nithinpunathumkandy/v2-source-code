import { TestBed } from '@angular/core/testing';

import { StrategyMappingService } from './strategy-mapping.service';

describe('StrategyMappingService', () => {
  let service: StrategyMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
