import { TestBed } from '@angular/core/testing';

import { BcpCallTreeService } from './bcp-call-tree.service';

describe('BcpCallTreeService', () => {
  let service: BcpCallTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcpCallTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
