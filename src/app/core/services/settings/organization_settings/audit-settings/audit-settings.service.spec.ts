import { TestBed } from '@angular/core/testing';

import { AuditSettingsService } from './audit-settings.service';

describe('AuditSettingsService', () => {
  let service: AuditSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
