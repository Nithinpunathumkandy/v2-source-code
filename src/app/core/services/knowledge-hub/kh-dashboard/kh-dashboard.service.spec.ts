import { TestBed } from '@angular/core/testing';

import { KhDashboardService } from './kh-dashboard.service';

describe('KhDashboardService', () => {
  let service: KhDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KhDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
