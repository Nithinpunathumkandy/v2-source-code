import { TestBed } from '@angular/core/testing';

import { AmAuditDocumentService } from './am-audit-document.service';

describe('AmAuditDocumentService', () => {
  let service: AmAuditDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
