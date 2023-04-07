import { TestBed } from '@angular/core/testing';

import { EventLessonLearnedService } from './event-lesson-learned.service';

describe('EventLessonLearnedService', () => {
  let service: EventLessonLearnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventLessonLearnedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
