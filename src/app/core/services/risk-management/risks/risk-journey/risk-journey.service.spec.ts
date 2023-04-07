import { TestBed } from '@angular/core/testing';

import { RiskJourneyService } from './risk-journey.service';

describe('RiskJourneyService', () => {
  let service: RiskJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
