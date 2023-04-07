import { TestBed } from '@angular/core/testing';

import { RiskImpactGuidelineService } from './risk-impact-guideline.service';

describe('RiskImpactGuidelineService', () => {
  let service: RiskImpactGuidelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskImpactGuidelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
