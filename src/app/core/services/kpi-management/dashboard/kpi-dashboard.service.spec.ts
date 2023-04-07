import { TestBed } from '@angular/core/testing';

import { KpiDashboardService } from './kpi-dashboard.service';

describe('KpiDashboardService', () => {
  let service: KpiDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
