import { TestBed } from '@angular/core/testing';

import { RiskMappingService } from './risk-mapping.service';

describe('RiskMappingService', () => {
  let service: RiskMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
