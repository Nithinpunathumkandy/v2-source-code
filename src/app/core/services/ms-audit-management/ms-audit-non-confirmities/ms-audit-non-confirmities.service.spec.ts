import { TestBed } from '@angular/core/testing';

import { MsAuditNonConfirmitiesService } from './ms-audit-non-confirmities.service';

describe('MsAuditNonConfirmitiesService', () => {
  let service: MsAuditNonConfirmitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditNonConfirmitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
