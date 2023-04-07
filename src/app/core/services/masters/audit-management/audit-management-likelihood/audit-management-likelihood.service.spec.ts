import { TestBed } from '@angular/core/testing';

import { AuditManagementLikelihoodService } from './audit-management-likelihood.service';

describe('AuditManagementLikelihoodService', () => {
  let service: AuditManagementLikelihoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditManagementLikelihoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
