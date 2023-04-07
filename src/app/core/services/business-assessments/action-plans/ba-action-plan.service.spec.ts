import { TestBed } from '@angular/core/testing';

import { BaActionPlanService } from './ba-action-plan.service';

describe('BaActionPlanService', () => {
  let service: BaActionPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaActionPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
