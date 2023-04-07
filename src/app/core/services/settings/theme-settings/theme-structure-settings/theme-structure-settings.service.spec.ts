import { TestBed } from '@angular/core/testing';

import { ThemeStructureSettingsService } from './theme-structure-settings.service';

describe('ThemeStructureSettingsService', () => {
  let service: ThemeStructureSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeStructureSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
