import { TestBed } from '@angular/core/testing';

import { AssetRatingsService } from './asset-ratings.service';

describe('AssetRatingsService', () => {
  let service: AssetRatingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetRatingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
