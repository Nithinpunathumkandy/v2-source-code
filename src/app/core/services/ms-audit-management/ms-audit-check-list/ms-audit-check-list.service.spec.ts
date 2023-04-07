import { TestBed } from '@angular/core/testing';

import { MsAuditCheckListService } from './ms-audit-check-list.service';

describe('MsAuditCheckListService', () => {
  let service: MsAuditCheckListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditCheckListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
