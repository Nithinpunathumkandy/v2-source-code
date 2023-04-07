import { TestBed } from '@angular/core/testing';

import { OrganizationSettingsService } from './organization-settings.service';

describe('OrganizationSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganizationSettingsService = TestBed.get(OrganizationSettingsService);
    expect(service).toBeTruthy();
  });
});
