import { TestBed } from '@angular/core/testing';

import { EventClosureEventDetailsService } from './event-closure-event-details.service';

describe('EventClosureEventDetailsService', () => {
  let service: EventClosureEventDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventClosureEventDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
