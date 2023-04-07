import { TestBed } from '@angular/core/testing';

import { IsmsRootCauseAnalysisService } from './isms-root-cause-analysis.service';

describe('IsmsRootCauseAnalysisService', () => {
  let service: IsmsRootCauseAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRootCauseAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
