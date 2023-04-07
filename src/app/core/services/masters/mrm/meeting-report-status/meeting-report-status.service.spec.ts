import { TestBed } from '@angular/core/testing';

import { MeetingReportStatusService } from './meeting-report-status.service';

describe('MeetingReportStatusService', () => {
  let service: MeetingReportStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingReportStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
