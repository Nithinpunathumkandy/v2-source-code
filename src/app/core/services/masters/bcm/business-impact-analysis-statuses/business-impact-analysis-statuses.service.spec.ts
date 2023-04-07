import { TestBed } from '@angular/core/testing';

import { BusinessImpactAnalysisStatusesService } from './business-impact-analysis-statuses.service';

describe('BusinessImpactAnalysisStatusesService', () => {
  let service: BusinessImpactAnalysisStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessImpactAnalysisStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
