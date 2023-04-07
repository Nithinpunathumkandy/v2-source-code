import { TestBed } from '@angular/core/testing';

import { BcmRiskJourneyService } from './bcm-risk-journey.service';

describe('BcmRiskJourneyService', () => {
  let service: BcmRiskJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmRiskJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
