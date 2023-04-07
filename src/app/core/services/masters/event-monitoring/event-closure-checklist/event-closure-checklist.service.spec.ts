import { TestBed } from '@angular/core/testing';

import { EventClosureChecklistService } from './event-closure-checklist.service';

describe('EventClosureChecklistService', () => {
  let service: EventClosureChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventClosureChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
