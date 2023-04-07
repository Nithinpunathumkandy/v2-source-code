import { TestBed } from '@angular/core/testing';

import { AppUserFeedbackService } from './app-user-feedback.service';

describe('AppUserFeedbackService', () => {
  let service: AppUserFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUserFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
