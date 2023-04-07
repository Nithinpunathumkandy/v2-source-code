import { TestBed } from '@angular/core/testing';

import { RiskStatusService } from './risk-status.service';

describe('RiskStatusService', () => {
  let service: RiskStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
