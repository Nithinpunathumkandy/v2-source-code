import { TestBed } from '@angular/core/testing';

import { AmAuditCommencementLetterService } from './am-audit-commencement-letter.service';

describe('AmAuditCommencementLetterService', () => {
  let service: AmAuditCommencementLetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditCommencementLetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
