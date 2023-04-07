import { TestBed } from '@angular/core/testing';

import { MockDrillActionPlanService } from './mock-drill-action-plan.service';

describe('MockDrillActionPlanService', () => {
  let service: MockDrillActionPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillActionPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
