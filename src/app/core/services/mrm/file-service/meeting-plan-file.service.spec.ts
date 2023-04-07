import { TestBed } from '@angular/core/testing';

import { MeetingPlanFileService } from './meeting-plan-file.service';

describe('MeetingPlanFileService', () => {
  let service: MeetingPlanFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingPlanFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
