import { TestBed } from '@angular/core/testing';

import { ProjectManagementInfoService } from './project-management-info.service';

describe('ProjectManagementInfoService', () => {
  let service: ProjectManagementInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectManagementInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
