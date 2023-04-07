import { TestBed } from '@angular/core/testing';

import { MeetingReportTemplatesService } from './meeting-report-templates.service';

describe('MeetingReportTemplatesService', () => {
  let service: MeetingReportTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingReportTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
