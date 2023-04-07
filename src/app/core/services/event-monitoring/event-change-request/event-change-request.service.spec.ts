import { TestBed } from '@angular/core/testing';

import { EventChangeRequestService } from './event-change-request.service';

describe('EventChangeRequestService', () => {
  let service: EventChangeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventChangeRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
