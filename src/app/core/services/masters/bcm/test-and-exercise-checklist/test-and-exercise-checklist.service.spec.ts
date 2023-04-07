import { TestBed } from '@angular/core/testing';

import { TestAndExerciseChecklistService } from './test-and-exercise-checklist.service';

describe('TestAndExerciseChecklistService', () => {
  let service: TestAndExerciseChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestAndExerciseChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
