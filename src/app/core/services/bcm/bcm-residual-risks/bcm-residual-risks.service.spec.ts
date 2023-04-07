import { TestBed } from '@angular/core/testing';

import { BcmResidualRisksService } from './bcm-residual-risks.service';

describe('BcmResidualRisksService', () => {
  let service: BcmResidualRisksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmResidualRisksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
