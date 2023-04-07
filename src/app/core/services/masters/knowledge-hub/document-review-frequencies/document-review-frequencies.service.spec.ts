import { TestBed } from '@angular/core/testing';

import { DocumentReviewFrequenciesService } from './document-review-frequencies.service';

describe('DocumentReviewFrequenciesService', () => {
  let service: DocumentReviewFrequenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentReviewFrequenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
