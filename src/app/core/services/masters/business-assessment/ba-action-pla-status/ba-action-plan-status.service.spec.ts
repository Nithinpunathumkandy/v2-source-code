import { TestBed } from '@angular/core/testing';

import { BaActionPlanStatusService } from './ba-action-plan-status.service';

describe('BaActionPlanStatusService', () => {
  let service: BaActionPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaActionPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
