import { TestBed } from '@angular/core/testing';

import { RiskManagementSettingsService } from './risk-management-settings.service';

describe('RiskManagementSettingsService', () => {
  let service: RiskManagementSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskManagementSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
