import { TestBed } from '@angular/core/testing';

import { PendingReviewsService } from './pending-reviews.service';

describe('PendingReviewsService', () => {
  let service: PendingReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
