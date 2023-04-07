import { TestBed } from '@angular/core/testing';

import { BcpChangeRequestService } from './bcp-change-request.service';

describe('BcpChangeRequestService', () => {
  let service: BcpChangeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcpChangeRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
