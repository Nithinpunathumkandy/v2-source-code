import { TestBed } from '@angular/core/testing';

import { RiskControlPlanService } from './risk-control-plan.service';

describe('RiskControlPlanService', () => {
  let service: RiskControlPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskControlPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
