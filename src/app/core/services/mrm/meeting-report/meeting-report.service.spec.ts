import { TestBed } from '@angular/core/testing';

import { MeetingReportService } from './meeting-report.service';

describe('MeetingReportService', () => {
  let service: MeetingReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
