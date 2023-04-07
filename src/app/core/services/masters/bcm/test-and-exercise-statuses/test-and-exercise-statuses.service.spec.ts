import { TestBed } from '@angular/core/testing';

import { TestAndExerciseStatusesService } from './test-and-exercise-statuses.service';

describe('TestAndExerciseStatusesService', () => {
  let service: TestAndExerciseStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestAndExerciseStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
