import { TestBed } from '@angular/core/testing';

import { AssetMaintenanceCategoriesService } from './asset-maintenance-categories.service';

describe('AssetMaintenanceCategoriesService', () => {
  let service: AssetMaintenanceCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetMaintenanceCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
