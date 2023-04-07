import { TestBed } from '@angular/core/testing';

import { ProjectObjectiveService } from './project-objective.service';

describe('ProjectObjectiveService', () => {
  let service: ProjectObjectiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectObjectiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
