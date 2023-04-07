import { TestBed } from '@angular/core/testing';

import { IsmsRiskMappingService } from './isms-risk-mapping.service';

describe('IsmsRiskMappingService', () => {
  let service: IsmsRiskMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
