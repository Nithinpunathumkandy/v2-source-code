import { TestBed } from '@angular/core/testing';

import { ProjectTaskWeightageService } from './project-task-weightage.service';

describe('ProjectTaskWeightageService', () => {
  let service: ProjectTaskWeightageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTaskWeightageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
