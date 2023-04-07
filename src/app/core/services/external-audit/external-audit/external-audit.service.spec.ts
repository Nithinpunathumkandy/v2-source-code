import { TestBed } from '@angular/core/testing';

import { ExternalAuditService } from './external-audit.service';

describe('ExternalAuditService', () => {
  let service: ExternalAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
