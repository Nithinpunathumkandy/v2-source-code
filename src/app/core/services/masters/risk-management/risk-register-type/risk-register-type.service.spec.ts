import { TestBed } from '@angular/core/testing';

import { RiskRegisterTypeService } from './risk-register-type.service';

describe('RiskRegisterTypeService', () => {
  let service: RiskRegisterTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskRegisterTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
