import { TestBed } from '@angular/core/testing';

import { UnplannedMeetingService } from './unplanned-meeting.service';

describe('UnplannedMeetingService', () => {
  let service: UnplannedMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnplannedMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
