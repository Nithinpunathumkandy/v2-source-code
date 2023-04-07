import { TestBed } from '@angular/core/testing';

import { ComplianceDashboardService } from './compliance-dashboard.service';

describe('ComplianceDashboardService', () => {
  let service: ComplianceDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
