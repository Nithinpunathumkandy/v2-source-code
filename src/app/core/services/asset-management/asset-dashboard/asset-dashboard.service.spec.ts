import { TestBed } from '@angular/core/testing';

import { AssetDashboardService } from './asset-dashboard.service';

describe('AssetDashboardService', () => {
  let service: AssetDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
