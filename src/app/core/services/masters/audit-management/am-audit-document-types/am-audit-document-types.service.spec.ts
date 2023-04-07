import { TestBed } from '@angular/core/testing';

import { AmAuditDocumentTypesService } from './am-audit-document-types.service';

describe('AmAuditDocumentTypesService', () => {
  let service: AmAuditDocumentTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditDocumentTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
