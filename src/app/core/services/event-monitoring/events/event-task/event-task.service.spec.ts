import { TestBed } from '@angular/core/testing';

import { EventTaskService } from './event-task.service';

describe('EventTaskService', () => {
  let service: EventTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
