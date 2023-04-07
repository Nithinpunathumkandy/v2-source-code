import { TestBed } from '@angular/core/testing';

import { ProjectIssueStatusService } from './project-issue-status.service';

describe('ProjectIssueStatusService', () => {
  let service: ProjectIssueStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectIssueStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
