import { TestBed } from '@angular/core/testing';

import { BiaRatingService } from './bia-rating.service';

describe('BiaRatingService', () => {
  let service: BiaRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
