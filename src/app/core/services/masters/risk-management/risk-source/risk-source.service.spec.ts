import { TestBed } from '@angular/core/testing';

import { RiskSourceService } from './risk-source.service';

describe('RiskSourceService', () => {
  let service: RiskSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
