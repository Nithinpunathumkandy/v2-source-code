import { TestBed } from '@angular/core/testing';

import { KpiDetialsDashbordService } from './kpi-detials-dashbord.service';

describe('KpiDetialsDashbordService', () => {
  let service: KpiDetialsDashbordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiDetialsDashbordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
