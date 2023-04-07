import { TestBed } from '@angular/core/testing';

import { AssetMaintenanceService } from './asset-maintenance.service';

describe('AssetMaintenanceService', () => {
  let service: AssetMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
