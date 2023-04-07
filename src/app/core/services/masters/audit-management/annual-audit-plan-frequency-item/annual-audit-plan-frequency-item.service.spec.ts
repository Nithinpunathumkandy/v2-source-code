import { TestBed } from '@angular/core/testing';

import { AnnualAuditPlanFrequencyItemService } from './annual-audit-plan-frequency-item.service';

describe('AnnualAuditPlanFrequencyItemService', () => {
  let service: AnnualAuditPlanFrequencyItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualAuditPlanFrequencyItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
