import { TestBed } from '@angular/core/testing';

import { EventClosureService } from './event-closure.service';

describe('EventClosureService', () => {
  let service: EventClosureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventClosureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
