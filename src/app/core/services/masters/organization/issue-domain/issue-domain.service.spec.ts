import { TestBed } from '@angular/core/testing';

import { IssueDomainService } from './issue-domain.service';

describe('IssueDomainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueDomainService = TestBed.get(IssueDomainService);
    expect(service).toBeTruthy();
  });
});
