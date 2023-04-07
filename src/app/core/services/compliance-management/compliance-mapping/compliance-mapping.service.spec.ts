import { TestBed } from '@angular/core/testing';

import { ComplianceMappingService } from './compliance-mapping.service';

describe('ComplianceMappingService', () => {
  let service: ComplianceMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
