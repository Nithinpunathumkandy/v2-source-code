import { TestBed } from '@angular/core/testing';

import { IsmsImpactAnalysisService } from './isms-impact-analysis.service';

describe('IsmsImpactAnalysisService', () => {
  let service: IsmsImpactAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsImpactAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
