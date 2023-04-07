import { TestBed } from '@angular/core/testing';

import { AuditFindingsService } from './audit-findings.service';

describe('AuditFindingsService', () => {
  let service: AuditFindingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditFindingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
