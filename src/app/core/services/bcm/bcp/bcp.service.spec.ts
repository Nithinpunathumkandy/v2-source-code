import { TestBed } from '@angular/core/testing';

import { BcpService } from './bcp.service';

describe('BcpService', () => {
  let service: BcpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
