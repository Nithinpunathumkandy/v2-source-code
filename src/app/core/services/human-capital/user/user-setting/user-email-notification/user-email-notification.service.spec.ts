import { TestBed } from '@angular/core/testing';

import { UserEmailNotificationService } from './user-email-notification.service';

describe('UserEmailNotificationService', () => {
  let service: UserEmailNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEmailNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
