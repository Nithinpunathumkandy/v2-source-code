import { TestBed } from '@angular/core/testing';

import { ComplianceFrequencyService } from './compliance-frequency.service';

describe('ComplianceFrequencyService', () => {
  let service: ComplianceFrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceFrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
