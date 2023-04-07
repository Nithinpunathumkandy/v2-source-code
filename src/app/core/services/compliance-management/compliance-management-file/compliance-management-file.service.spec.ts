import { TestBed } from '@angular/core/testing';

import { ComplianceManagementFileService } from './compliance-management-file.service';

describe('ComplianceManagementFileService', () => {
  let service: ComplianceManagementFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceManagementFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
