import { TestBed } from '@angular/core/testing';

import { MsAuditSchedulesService } from './ms-audit-schedules.service';

describe('MsAuditSchedulesService', () => {
  let service: MsAuditSchedulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditSchedulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
