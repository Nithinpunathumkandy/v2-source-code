import { TestBed } from '@angular/core/testing';

import { RiskCeoDashboardService } from './risk-ceo-dashboard.service';

describe('RiskCeoDashboardService', () => {
  let service: RiskCeoDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskCeoDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
