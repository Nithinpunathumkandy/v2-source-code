import { TestBed } from '@angular/core/testing';

import { AppFeedbackSmileyService } from './app-feedback-smiley.service';

describe('AppFeedbackSmileyService', () => {
  let service: AppFeedbackSmileyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFeedbackSmileyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
