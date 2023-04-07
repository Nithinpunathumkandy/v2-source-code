import { TestBed } from '@angular/core/testing';

import { IntegrationSettingService } from './integration-setting.service';

describe('IntegrationSettingService', () => {
  let service: IntegrationSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
