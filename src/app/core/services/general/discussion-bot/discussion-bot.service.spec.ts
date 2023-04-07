import { TestBed } from '@angular/core/testing';

import { DiscussionBotService } from './discussion-bot.service';

describe('DiscussionBotService', () => {
  let service: DiscussionBotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscussionBotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
