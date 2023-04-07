import { TestBed } from '@angular/core/testing';

import { MsAuditStatusesService } from './ms-audit-statuses.service';

describe('MsAuditStatusesService', () => {
  let service: MsAuditStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
