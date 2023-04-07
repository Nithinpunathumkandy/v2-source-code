import { TestBed } from '@angular/core/testing';

import { ProjectPriorityService } from './project-priority.service';

describe('ProjectPriorityService', () => {
  let service: ProjectPriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectPriorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
