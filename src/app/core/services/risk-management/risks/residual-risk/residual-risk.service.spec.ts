import { TestBed } from '@angular/core/testing';

import { ResidualRiskService } from './residual-risk.service';

describe('ResidualRiskService', () => {
  let service: ResidualRiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidualRiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
