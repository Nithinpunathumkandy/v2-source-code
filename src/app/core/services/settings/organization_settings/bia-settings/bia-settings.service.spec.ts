import { TestBed } from '@angular/core/testing';

import { BiaSettingsService } from './bia-settings.service';

describe('BiaSettingsService', () => {
  let service: BiaSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
