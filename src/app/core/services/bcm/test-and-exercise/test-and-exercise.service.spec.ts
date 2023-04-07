import { TestBed } from '@angular/core/testing';

import { TestAndExerciseService } from './test-and-exercise.service';

describe('TestAndExerciseService', () => {
  let service: TestAndExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestAndExerciseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
