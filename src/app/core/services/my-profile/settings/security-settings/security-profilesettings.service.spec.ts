import { TestBed } from '@angular/core/testing';

import { SecurityProfilesettingsService } from './security-profilesettings.service';

describe('SecurityProfilesettingsService', () => {
  let service: SecurityProfilesettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityProfilesettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
