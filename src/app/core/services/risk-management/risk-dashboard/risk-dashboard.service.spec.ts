import { TestBed } from '@angular/core/testing';

import { RiskDashboardService } from './risk-dashboard.service';

describe('RiskDashboardService', () => {
  let service: RiskDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
