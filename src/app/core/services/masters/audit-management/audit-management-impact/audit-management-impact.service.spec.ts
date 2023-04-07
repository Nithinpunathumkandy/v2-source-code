import { TestBed } from '@angular/core/testing';

import { AuditManagementImpactService } from './audit-management-impact.service';

describe('AuditManagementImpactService', () => {
  let service: AuditManagementImpactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditManagementImpactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
