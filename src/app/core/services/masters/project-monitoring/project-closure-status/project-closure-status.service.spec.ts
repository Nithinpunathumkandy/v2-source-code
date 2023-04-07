import { TestBed } from '@angular/core/testing';

import { ProjectClosureStatusService } from './project-closure-status.service';

describe('ProjectClosureStatusService', () => {
  let service: ProjectClosureStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectClosureStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
