import { TestBed } from '@angular/core/testing';

import { HiraJourneyService } from './hira-journey.service';

describe('HiraJourneyService', () => {
  let service: HiraJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiraJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
