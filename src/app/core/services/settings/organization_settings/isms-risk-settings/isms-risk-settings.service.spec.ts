import { TestBed } from '@angular/core/testing';

import { IsmsRiskSettingsService } from './isms-risk-settings.service';

describe('IsmsRiskSettingsService', () => {
  let service: IsmsRiskSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRiskSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
