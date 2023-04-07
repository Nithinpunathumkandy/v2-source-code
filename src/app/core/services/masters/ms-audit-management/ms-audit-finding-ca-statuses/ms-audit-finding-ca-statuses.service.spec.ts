import { TestBed } from '@angular/core/testing';

import { MsAuditFindingCaStatusesService } from './ms-audit-finding-ca-statuses.service';

describe('MsAuditFindingCaStatusesService', () => {
  let service: MsAuditFindingCaStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditFindingCaStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
