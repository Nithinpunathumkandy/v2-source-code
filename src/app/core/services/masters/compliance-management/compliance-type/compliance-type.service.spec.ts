import { TestBed } from '@angular/core/testing';

import { ComplianceTypeService } from './compliance-type.service';

describe('ComplianceTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComplianceTypeService = TestBed.get(ComplianceTypeService);
    expect(service).toBeTruthy();
  });
});
