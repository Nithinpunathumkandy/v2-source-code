import { TestBed } from '@angular/core/testing';

import { KpiReviewFrequenciesService } from './kpi-review-frequencies.service';

describe('KpiReviewFrequenciesService', () => {
  let service: KpiReviewFrequenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiReviewFrequenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
