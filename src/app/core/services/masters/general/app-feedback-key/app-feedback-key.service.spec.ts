import { TestBed } from '@angular/core/testing';

import { AppFeedbackKeyService } from './app-feedback-key.service';

describe('AppFeedbackKeyService', () => {
  let service: AppFeedbackKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFeedbackKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
