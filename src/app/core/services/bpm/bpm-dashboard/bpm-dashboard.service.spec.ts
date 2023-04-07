import { TestBed } from '@angular/core/testing';

import { BpmDashboardService } from './bpm-dashboard.service';

describe('BpmDashboardService', () => {
  let service: BpmDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
