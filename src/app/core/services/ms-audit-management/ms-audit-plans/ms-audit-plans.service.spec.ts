import { TestBed } from '@angular/core/testing';

import { MsAuditPlansService } from './ms-audit-plans.service';

describe('MsAuditPlansService', () => {
  let service: MsAuditPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
