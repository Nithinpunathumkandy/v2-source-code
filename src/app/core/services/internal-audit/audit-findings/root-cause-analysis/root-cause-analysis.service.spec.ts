import { TestBed } from '@angular/core/testing';

import { RootCauseAnalysisService } from './root-cause-analysis.service';

describe('RootCauseAnalysisService', () => {
  let service: RootCauseAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootCauseAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
