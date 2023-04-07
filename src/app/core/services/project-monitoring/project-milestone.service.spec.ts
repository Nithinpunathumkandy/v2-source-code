import { TestBed } from '@angular/core/testing';

import { ProjectMilestoneService } from './project-milestone.service';

describe('ProjectMilestoneService', () => {
  let service: ProjectMilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMilestoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
