import { TestBed } from '@angular/core/testing';

import { ComplianceStatusService } from './compliance-status.service';

describe('ComplianceStatusService', () => {
  let service: ComplianceStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
