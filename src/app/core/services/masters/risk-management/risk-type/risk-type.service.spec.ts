import { TestBed } from '@angular/core/testing';

import { RiskTypeService } from './risk-type.service';

describe('RiskTypeService', () => {
  let service: RiskTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
