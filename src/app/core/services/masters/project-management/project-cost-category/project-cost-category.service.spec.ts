import { TestBed } from '@angular/core/testing';

import { ProjectCostCategoryService } from './project-cost-category.service';

describe('ProjectCostCategoryService', () => {
  let service: ProjectCostCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCostCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
