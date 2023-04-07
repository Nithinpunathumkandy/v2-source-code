import { TestBed } from '@angular/core/testing';

import { AssetManagementSettingsService } from './asset-management-settings.service';

describe('AssetManagementSettingsService', () => {
  let service: AssetManagementSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetManagementSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
