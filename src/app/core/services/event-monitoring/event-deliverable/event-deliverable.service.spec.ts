import { TestBed } from '@angular/core/testing';

import { EventDeliverableService } from './event-deliverable.service';

describe('EventDeliverableService', () => {
  let service: EventDeliverableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDeliverableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
