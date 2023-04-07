import { TestBed } from '@angular/core/testing';

import { PermissionSettingsService } from './permission-settings.service';

describe('PermissionSettingsService', () => {
  let service: PermissionSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
