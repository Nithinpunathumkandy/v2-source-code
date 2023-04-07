import { TestBed } from '@angular/core/testing';

import { EventStakeholderService } from './event-stakeholder.service';

describe('EventStakeholderService', () => {
  let service: EventStakeholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventStakeholderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
