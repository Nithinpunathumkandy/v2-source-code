import { TestBed } from '@angular/core/testing';

import { EventRiskJourneyService } from './event-risk-journey.service';

describe('EventRiskJourneyService', () => {
  let service: EventRiskJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRiskJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
