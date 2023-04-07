import { TestBed } from '@angular/core/testing';

import { SlaContractMappingService } from './sla-contract-mapping.service';

describe('SlaContractMappingService', () => {
  let service: SlaContractMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaContractMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
