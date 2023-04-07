import { TestBed } from '@angular/core/testing';

import { AuditManagementRiskRatingService } from './audit-management-risk-rating.service';

describe('AuditManagementRiskRatingService', () => {
  let service: AuditManagementRiskRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditManagementRiskRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
