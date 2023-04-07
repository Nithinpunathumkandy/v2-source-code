import { TestBed } from '@angular/core/testing';

import { MeetingActionPlanStatusService } from './meeting-action-plan-status.service';

describe('MeetingActionPlanStatusService', () => {
  let service: MeetingActionPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingActionPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
