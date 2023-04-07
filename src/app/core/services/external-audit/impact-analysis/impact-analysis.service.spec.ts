import { TestBed } from '@angular/core/testing';

import { ImpactAnalysisService } from './impact-analysis.service';

describe('ImpactAnalysisService', () => {
  let service: ImpactAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpactAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
