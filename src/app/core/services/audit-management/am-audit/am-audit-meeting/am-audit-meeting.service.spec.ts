import { TestBed } from '@angular/core/testing';

import { AmAuditMeetingService } from './am-audit-meeting.service';

describe('AmAuditMeetingService', () => {
  let service: AmAuditMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
