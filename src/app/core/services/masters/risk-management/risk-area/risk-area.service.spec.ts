import { TestBed } from '@angular/core/testing';

import { RiskAreaService } from './risk-area.service';

describe('RiskAreaService', () => {
  let service: RiskAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
