import { TestBed } from '@angular/core/testing';

import { AccessProfilesettingsService } from './access-profilesettings.service';

describe('AccessProfilesettingsService', () => {
  let service: AccessProfilesettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessProfilesettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
