import { TestBed } from '@angular/core/testing';

import { ProjectSettingsIssueCategoryService } from './project-settings-issue-category.service';

describe('ProjectSettingsIssueCategoryService', () => {
  let service: ProjectSettingsIssueCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSettingsIssueCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
