import { TestBed } from '@angular/core/testing';

import { StrategyManagementSettingsServiceService } from './strategy-management-settings-service.service';

describe('StrategyManagementSettingsServiceService', () => {
  let service: StrategyManagementSettingsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyManagementSettingsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
