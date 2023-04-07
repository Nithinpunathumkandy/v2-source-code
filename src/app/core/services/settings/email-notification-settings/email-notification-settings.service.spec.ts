import { TestBed } from '@angular/core/testing';

import { EmailNotificationSettingsService } from './email-notification-settings.service';

describe('EmailNotificationSettingsService', () => {
  let service: EmailNotificationSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailNotificationSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
