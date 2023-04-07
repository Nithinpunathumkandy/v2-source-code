import { TestBed } from '@angular/core/testing';

import { AmAuditDashboardService } from './am-audit-dashboard.service';

describe('AmAuditDashboardService', () => {
  let service: AmAuditDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
