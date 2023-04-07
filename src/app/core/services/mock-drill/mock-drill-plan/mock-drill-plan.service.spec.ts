import { TestBed } from '@angular/core/testing';

import { MockDrillPlanService } from './mock-drill-plan.service';

describe('MockDrillPlanService', () => {
  let service: MockDrillPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
