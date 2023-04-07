import { TestBed } from '@angular/core/testing';

import { MyprofileGeneralSettingsService } from './myprofile-general-settings.service';

describe('MyprofileGeneralSettingsService', () => {
  let service: MyprofileGeneralSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyprofileGeneralSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
