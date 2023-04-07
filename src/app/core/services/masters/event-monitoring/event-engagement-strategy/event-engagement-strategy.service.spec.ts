import { TestBed } from '@angular/core/testing';

import { EventEngagementStrategyService } from './event-engagement-strategy.service';

describe('EventEngagementStrategyService', () => {
  let service: EventEngagementStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventEngagementStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
