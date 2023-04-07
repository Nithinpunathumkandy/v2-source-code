import { TestBed } from '@angular/core/testing';

import { KpiImprovementPlanStatuesService } from './kpi-improvement-plan-statues.service';

describe('KpiImprovementPlanStatuesService', () => {
  let service: KpiImprovementPlanStatuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiImprovementPlanStatuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
