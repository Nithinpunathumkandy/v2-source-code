import { TestBed } from '@angular/core/testing';

import { ComplianceActionPlanStatusService } from './compliance-action-plan-status.service';

describe('ComplianceActionPlanStatusService', () => {
  let service: ComplianceActionPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceActionPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
