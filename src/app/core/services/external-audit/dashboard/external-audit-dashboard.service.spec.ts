import { TestBed } from '@angular/core/testing';

import { ExternalAuditDashboardService } from './external-audit-dashboard.service';

describe('ExternalAuditDashboardService', () => {
  let service: ExternalAuditDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalAuditDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
