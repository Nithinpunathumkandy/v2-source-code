import { TestBed } from '@angular/core/testing';

import { AuditManagementSettingsService } from './audit-management-settings.service';

describe('AuditManagementSettingsService', () => {
  let service: AuditManagementSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditManagementSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
