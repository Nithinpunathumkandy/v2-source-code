import { TestBed } from '@angular/core/testing';

import { ExternalAuditTypesService } from './external-audit-types.service';

describe('ExternalAuditTypesService', () => {
  let service: ExternalAuditTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalAuditTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
