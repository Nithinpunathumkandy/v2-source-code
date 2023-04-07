import { TestBed } from '@angular/core/testing';

import { LoginSettingsService } from './login-settings.service';

describe('LoginSettingsService', () => {
  let service: LoginSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
