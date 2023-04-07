import { TestBed } from '@angular/core/testing';

import { ComplianceActionPlanService } from './compliance-action-plan.service';

describe('ComplianceActionPlanService', () => {
  let service: ComplianceActionPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceActionPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
