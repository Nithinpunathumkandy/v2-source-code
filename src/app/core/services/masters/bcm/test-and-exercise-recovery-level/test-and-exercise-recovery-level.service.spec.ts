import { TestBed } from '@angular/core/testing';

import { TestAndExerciseRecoveryLevelService } from './test-and-exercise-recovery-level.service';

describe('TestAndExerciseRecoveryLevelService', () => {
  let service: TestAndExerciseRecoveryLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestAndExerciseRecoveryLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
