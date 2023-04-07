import { TestBed } from '@angular/core/testing';

import { SlaContractService } from './sla-contract.service';

describe('SlaContractService', () => {
  let service: SlaContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
