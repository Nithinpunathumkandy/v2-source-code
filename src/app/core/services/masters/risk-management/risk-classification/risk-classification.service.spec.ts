import { TestBed } from '@angular/core/testing';

import { RiskClassificationService } from './risk-classification.service';

describe('RiskClassificationService', () => {
  let service: RiskClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
