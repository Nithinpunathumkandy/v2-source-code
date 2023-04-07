import { TestBed } from '@angular/core/testing';

import { LikelihoodService } from './likelihood.service';

describe('LikelihoodService', () => {
  let service: LikelihoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikelihoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
