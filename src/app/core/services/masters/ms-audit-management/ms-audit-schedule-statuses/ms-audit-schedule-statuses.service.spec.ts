import { TestBed } from '@angular/core/testing';

import { MsAuditScheduleStatusesService } from './ms-audit-schedule-statuses.service';

describe('MsAuditScheduleStatusesService', () => {
  let service: MsAuditScheduleStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditScheduleStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
