import { TestBed } from '@angular/core/testing';

import { RiskRegisterService } from './risk-register.service';

describe('RiskRegisterService', () => {
  let service: RiskRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
