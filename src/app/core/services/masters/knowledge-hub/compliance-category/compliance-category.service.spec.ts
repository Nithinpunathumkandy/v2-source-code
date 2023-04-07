import { TestBed } from '@angular/core/testing';

import { ComplianceCategoryService } from './compliance-category.service';

describe('ComplianceCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComplianceCategoryService = TestBed.get(ComplianceCategoryService);
    expect(service).toBeTruthy();
  });
});
