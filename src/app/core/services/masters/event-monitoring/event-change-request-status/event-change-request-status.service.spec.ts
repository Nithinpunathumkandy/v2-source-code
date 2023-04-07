import { TestBed } from '@angular/core/testing';

import { EventChangeRequestStatusService } from './event-change-request-status.service';

describe('EventChangeRequestStatusService', () => {
  let service: EventChangeRequestStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventChangeRequestStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
