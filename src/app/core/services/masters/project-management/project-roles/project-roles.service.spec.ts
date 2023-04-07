import { TestBed } from '@angular/core/testing';

import { ProjectRolesService } from './project-roles.service';

describe('ProjectRolesService', () => {
  let service: ProjectRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
