import { TestBed } from '@angular/core/testing';

import { MeetingObjectiveService } from './meeting-objective.service';

describe('MeetingObjectiveService', () => {
  let service: MeetingObjectiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingObjectiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
