import { TestBed } from '@angular/core/testing';

import { BcmDashboardService } from './bcm-dashboard.service';

describe('BcmDashboardService', () => {
  let service: BcmDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
