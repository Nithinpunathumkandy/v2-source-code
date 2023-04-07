import { TestBed } from '@angular/core/testing';

import { AvailableAuditorsService } from './available-auditors.service';

describe('AvailableAuditorsService', () => {
  let service: AvailableAuditorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableAuditorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
