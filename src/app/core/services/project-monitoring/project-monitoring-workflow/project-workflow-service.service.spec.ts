import { TestBed } from '@angular/core/testing';

import { ProjectWorkflowServiceService } from './project-workflow-service.service';

describe('ProjectWorkflowServiceService', () => {
  let service: ProjectWorkflowServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectWorkflowServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
