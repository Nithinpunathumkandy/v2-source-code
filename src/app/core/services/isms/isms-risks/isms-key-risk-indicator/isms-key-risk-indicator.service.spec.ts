import { TestBed } from '@angular/core/testing';

import { IsmsKeyRiskIndicatorService } from './isms-key-risk-indicator.service';

describe('IsmsKeyRiskIndicatorService', () => {
  let service: IsmsKeyRiskIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsKeyRiskIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
