import { TestBed } from '@angular/core/testing';

import { InternalAuditDashboardService } from './internal-audit-dashboard.service';

describe('InternalAuditDashboardService', () => {
  let service: InternalAuditDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalAuditDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
