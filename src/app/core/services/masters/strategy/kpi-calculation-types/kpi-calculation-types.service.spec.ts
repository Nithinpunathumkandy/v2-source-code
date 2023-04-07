import { TestBed } from '@angular/core/testing';

import { KpiCalculationTypesService } from './kpi-calculation-types.service';

describe('KpiCalculationTypesService', () => {
  let service: KpiCalculationTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiCalculationTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
