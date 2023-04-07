import { TestBed } from '@angular/core/testing';

import { AmAuditInformationRequestService } from './am-audit-information-request.service';

describe('AmAuditInformationRequestService', () => {
  let service: AmAuditInformationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditInformationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
