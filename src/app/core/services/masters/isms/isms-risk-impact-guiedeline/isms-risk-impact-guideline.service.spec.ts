import { TestBed } from '@angular/core/testing';

import { IsmsRiskImpactGuidelineService } from './isms-risk-impact-guideline.service';

describe('IsmsRiskImpactGuidelineService', () => {
  let service: IsmsRiskImpactGuidelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskImpactGuidelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
