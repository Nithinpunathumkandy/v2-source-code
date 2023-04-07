import { TestBed } from '@angular/core/testing';

import { AmAnnualPlanStatusService } from './am-annual-plan-status.service';

describe('AmAnnualPlanStatusService', () => {
  let service: AmAnnualPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAnnualPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
