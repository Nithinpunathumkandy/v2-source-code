import { TestBed } from '@angular/core/testing';

import { KpiTypesService } from './kpi-types.service';

describe('KpiTypesService', () => {
  let service: KpiTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
