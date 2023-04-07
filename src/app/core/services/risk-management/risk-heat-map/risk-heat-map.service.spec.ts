import { TestBed } from '@angular/core/testing';

import { RiskHeatMapService } from './risk-heat-map.service';

describe('RiskHeatMapService', () => {
  let service: RiskHeatMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskHeatMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
