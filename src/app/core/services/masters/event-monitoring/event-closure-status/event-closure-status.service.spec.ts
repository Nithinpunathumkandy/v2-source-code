import { TestBed } from '@angular/core/testing';

import { EventClosureStatusService } from './event-closure-status.service';

describe('EventClosureStatusService', () => {
  let service: EventClosureStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventClosureStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
