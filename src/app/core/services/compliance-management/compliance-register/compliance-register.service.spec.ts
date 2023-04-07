import { TestBed } from '@angular/core/testing';

import { ComplianceRegisterService } from './compliance-register.service';

describe('ComplianceRegisterService', () => {
  let service: ComplianceRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
