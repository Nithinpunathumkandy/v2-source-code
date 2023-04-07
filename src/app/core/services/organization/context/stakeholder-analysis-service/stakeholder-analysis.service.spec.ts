import { TestBed } from '@angular/core/testing';

import { StakeholderAnalysisService } from './stakeholder-analysis.service';

describe('StakeholderAnalysisService', () => {
  let service: StakeholderAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakeholderAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
