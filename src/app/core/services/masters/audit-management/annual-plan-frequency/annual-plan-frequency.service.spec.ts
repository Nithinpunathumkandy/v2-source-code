import { TestBed } from '@angular/core/testing';

import { AnnualPlanFrequencyService } from './annual-plan-frequency.service';

describe('AnnualPlanFrequencyService', () => {
  let service: AnnualPlanFrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualPlanFrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
