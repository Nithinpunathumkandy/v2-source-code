import { TestBed } from '@angular/core/testing';

import { KhSettingsService } from './kh-settings.service';

describe('KhSettingsService', () => {
  let service: KhSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KhSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
