import { TestBed } from '@angular/core/testing';

import { ThemeFooterSettingsService } from './theme-footer-settings.service';

describe('ThemeFooterSettingsService', () => {
  let service: ThemeFooterSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeFooterSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
