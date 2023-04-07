import { TestBed } from '@angular/core/testing';

import { AuditCheckListService } from './audit-check-list.service';

describe('AuditCheckListService', () => {
  let service: AuditCheckListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditCheckListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
