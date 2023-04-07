import { TestBed } from '@angular/core/testing';

import { MeetingPlanService } from './meeting-plan.service';

describe('MeetingPlanService', () => {
  let service: MeetingPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
