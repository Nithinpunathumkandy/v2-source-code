import { TestBed } from '@angular/core/testing';

import { RiskFindingTypeService } from './risk-finding-type.service';

describe('RiskFindingTypeService', () => {
  let service: RiskFindingTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskFindingTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
