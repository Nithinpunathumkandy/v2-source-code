import { TestBed } from '@angular/core/testing';

import { MrmDashboardService } from './mrm-dashboard.service';

describe('MrmDashboardService', () => {
  let service: MrmDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MrmDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
