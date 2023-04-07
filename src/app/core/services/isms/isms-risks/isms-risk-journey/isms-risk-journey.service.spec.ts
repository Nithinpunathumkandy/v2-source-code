import { TestBed } from '@angular/core/testing';

import { IsmsRiskJourneyService } from './isms-risk-journey.service';

describe('IsmsRiskJourneyService', () => {
  let service: IsmsRiskJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
