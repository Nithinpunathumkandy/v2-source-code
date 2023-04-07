import { TestBed } from '@angular/core/testing';

import { ByDepartmentChartService } from './by-department-chart.service';

describe('ByDepartmentChartService', () => {
  let service: ByDepartmentChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByDepartmentChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
