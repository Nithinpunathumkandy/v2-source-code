import { TestBed } from '@angular/core/testing';

import { MockDrillActionPlanStatusService } from './mock-drill-action-plan-status.service';

describe('MockDrillActionPlanStatusService', () => {
  let service: MockDrillActionPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillActionPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
