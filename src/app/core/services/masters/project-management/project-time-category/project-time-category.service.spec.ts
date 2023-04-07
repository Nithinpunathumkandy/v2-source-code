import { TestBed } from '@angular/core/testing';

import { ProjectTimeCategoryService } from './project-time-category.service';

describe('ProjectTimeCategoryService', () => {
  let service: ProjectTimeCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTimeCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
