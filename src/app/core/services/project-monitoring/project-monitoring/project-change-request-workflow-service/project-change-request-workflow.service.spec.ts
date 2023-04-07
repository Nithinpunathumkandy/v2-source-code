import { TestBed } from '@angular/core/testing';

import { ProjectChangeRequestWorkflowService } from './project-change-request-workflow.service';

describe('ProjectChangeRequestWorkflowService', () => {
  let service: ProjectChangeRequestWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectChangeRequestWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
