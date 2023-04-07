import { TestBed } from '@angular/core/testing';

import { KpiManagementFileService } from './kpi-management-file.service';

describe('KpiManagementFileService', () => {
  let service: KpiManagementFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiManagementFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
