import { TestBed } from '@angular/core/testing';

import { KpiManagementStatusService } from './kpi-management-status.service';

describe('KpiManagementStatusService', () => {
  let service: KpiManagementStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiManagementStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
