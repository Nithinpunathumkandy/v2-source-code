import { TestBed } from '@angular/core/testing';

import { StrategyThemeService } from './strategy-theme.service';

describe('StrategyThemeService', () => {
  let service: StrategyThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
