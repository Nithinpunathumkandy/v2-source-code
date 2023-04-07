import { TestBed } from '@angular/core/testing';

import { ThemeLoginSettingsService } from './theme-login-settings.service';

describe('ThemeLoginSettingsService', () => {
  let service: ThemeLoginSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeLoginSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
