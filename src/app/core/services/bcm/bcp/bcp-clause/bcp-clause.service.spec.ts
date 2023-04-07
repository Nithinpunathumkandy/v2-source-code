import { TestBed } from '@angular/core/testing';

import { BcpClauseService } from './bcp-clause.service';

describe('BcpClauseService', () => {
  let service: BcpClauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcpClauseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
