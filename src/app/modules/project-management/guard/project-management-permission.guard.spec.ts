import { TestBed } from '@angular/core/testing';

import { ProjectManagementPermissionGuard } from './project-management-permission.guard';

describe('ProjectManagementPermissionGuard', () => {
  let guard: ProjectManagementPermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProjectManagementPermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
