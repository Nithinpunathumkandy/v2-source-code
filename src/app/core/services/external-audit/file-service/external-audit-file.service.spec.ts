import { TestBed } from '@angular/core/testing';

import { ExternalAuditFileService } from './external-audit-file.service';

describe('ExternalAuditFileService', () => {
  let service: ExternalAuditFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalAuditFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
