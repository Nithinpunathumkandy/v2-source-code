import { TestBed } from '@angular/core/testing';

import { RiskTreatmentStatusesService } from './risk-treatment-statuses.service';

describe('RiskTreatmentStatusesService', () => {
  let service: RiskTreatmentStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskTreatmentStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
