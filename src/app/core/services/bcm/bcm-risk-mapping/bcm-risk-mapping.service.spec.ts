import { TestBed } from '@angular/core/testing';

import { BcmRiskMappingService } from './bcm-risk-mapping.service';

describe('BcmRiskMappingService', () => {
  let service: BcmRiskMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmRiskMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
