import { TestBed } from '@angular/core/testing';

import { ProjectTaskCategoryService } from './project-task-category.service';

describe('ProjectTaskCategoryService', () => {
  let service: ProjectTaskCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTaskCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
