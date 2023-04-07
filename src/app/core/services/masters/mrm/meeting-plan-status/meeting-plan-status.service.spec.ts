import { TestBed } from '@angular/core/testing';

import { MeetingPlanStatusService } from './meeting-plan-status.service';

describe('MeetingPlanStatusService', () => {
  let service: MeetingPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
