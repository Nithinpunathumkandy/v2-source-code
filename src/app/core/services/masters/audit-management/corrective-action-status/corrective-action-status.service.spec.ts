import { TestBed } from '@angular/core/testing';

import { AuditStatusesService } from './audit-statuses.service';

describe('AuditStatusesService', () => {
  let service: AuditStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
