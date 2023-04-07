import { TestBed } from '@angular/core/testing';

import { IsmsResidualRiskService } from './isms-residual-risk.service';

describe('IsmsResidualRiskService', () => {
  let service: IsmsResidualRiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsResidualRiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
