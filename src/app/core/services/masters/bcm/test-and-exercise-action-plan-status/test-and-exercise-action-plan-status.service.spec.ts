import { TestBed } from '@angular/core/testing';

import { TestAndExerciseActionPlanStatusService } from './test-and-exercise-action-plan-status.service';

describe('TestAndExerciseActionPlanStatusService', () => {
  let service: TestAndExerciseActionPlanStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestAndExerciseActionPlanStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
