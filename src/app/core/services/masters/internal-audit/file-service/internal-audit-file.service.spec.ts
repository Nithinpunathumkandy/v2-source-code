import { TestBed } from '@angular/core/testing';

import { InternalAuditFileService } from './internal-audit-file.service';

describe('InternalAuditFileService', () => {
  let service: InternalAuditFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalAuditFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
