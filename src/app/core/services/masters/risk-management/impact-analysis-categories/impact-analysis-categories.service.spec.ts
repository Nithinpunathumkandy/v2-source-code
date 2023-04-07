import { TestBed } from '@angular/core/testing';

import { ImpactAnalysisCategoriesService } from './impact-analysis-categories.service';

describe('ImpactAnalysisCategoriesService', () => {
  let service: ImpactAnalysisCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpactAnalysisCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
