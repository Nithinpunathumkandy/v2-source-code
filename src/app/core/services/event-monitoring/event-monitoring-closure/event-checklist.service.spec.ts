import { TestBed } from '@angular/core/testing';

import { EventChecklistService } from './event-checklist.service';

describe('EventChecklistService', () => {
  let service: EventChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
