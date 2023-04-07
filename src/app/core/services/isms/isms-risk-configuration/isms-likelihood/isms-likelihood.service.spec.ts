import { TestBed } from '@angular/core/testing';

import { IsmsLikelihoodService } from './isms-likelihood.service';

describe('IsmsLikelihoodService', () => {
  let service: IsmsLikelihoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsLikelihoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
