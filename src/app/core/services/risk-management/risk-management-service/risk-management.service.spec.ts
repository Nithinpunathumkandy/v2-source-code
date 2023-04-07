import { TestBed } from '@angular/core/testing';

import { RiskManagementService } from './risk-management.service';

describe('RiskManagementService', () => {
  let service: RiskManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
