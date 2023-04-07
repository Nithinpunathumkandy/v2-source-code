import { TestBed } from '@angular/core/testing';

import { FindingImpactAnalysisCategoryService } from './finding-impact-analysis-category.service';

describe('FindingImpactAnalysisCategoryService', () => {
  let service: FindingImpactAnalysisCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindingImpactAnalysisCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
