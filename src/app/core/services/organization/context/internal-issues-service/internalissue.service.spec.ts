import { TestBed } from '@angular/core/testing';

import { InternalissueService } from './internalissue.service';

describe('InternalissueService', () => {
  let service: InternalissueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalissueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
