import { TestBed } from '@angular/core/testing';

import { MsAuditPlanCriteriaService } from './ms-audit-plan-criteria.service';

describe('MsAuditPlanCriteriaService', () => {
  let service: MsAuditPlanCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditPlanCriteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
