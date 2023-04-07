import { TestBed } from '@angular/core/testing';

import { ProjectManagementProjectsService } from './project-management-projects.service';

describe('ProjectManagementProjectsService', () => {
  let service: ProjectManagementProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectManagementProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
