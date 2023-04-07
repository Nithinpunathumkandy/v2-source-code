import { TestBed } from '@angular/core/testing';

import { EventLessonLearntCaService } from './event-lesson-learnt-ca.service';

describe('EventLessonLearntCaService', () => {
  let service: EventLessonLearntCaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventLessonLearntCaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
