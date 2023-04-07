import { TestBed } from '@angular/core/testing';

import { CyberIncidentImpactAnalysisCategoryService } from './cyber-incident-impact-analysis-category.service';

describe('CyberIncidentImpactAnalysisCategoryService', () => {
  let service: CyberIncidentImpactAnalysisCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentImpactAnalysisCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
