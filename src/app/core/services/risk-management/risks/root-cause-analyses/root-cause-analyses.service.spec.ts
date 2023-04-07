import { TestBed } from '@angular/core/testing';

import { RootCauseAnalysesService } from './root-cause-analyses.service';

describe('RootCauseAnalysesService', () => {
  let service: RootCauseAnalysesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootCauseAnalysesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
