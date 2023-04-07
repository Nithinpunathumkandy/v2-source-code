import { TestBed } from '@angular/core/testing';

import { TaskPhaseService } from './task-phase.service';

describe('TaskPhaseService', () => {
  let service: TaskPhaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskPhaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
