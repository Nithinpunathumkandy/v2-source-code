import { TestBed } from '@angular/core/testing';

import { MsAuditFindingCaTypesService } from './ms-audit-finding-ca-types.service';

describe('MsAuditFindingCaTypesService', () => {
  let service: MsAuditFindingCaTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditFindingCaTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
