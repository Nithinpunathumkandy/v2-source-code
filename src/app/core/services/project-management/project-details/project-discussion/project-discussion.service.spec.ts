import { TestBed } from '@angular/core/testing';

import { ProjectDiscussionService } from './project-discussion.service';

describe('ProjectDiscussionService', () => {
  let service: ProjectDiscussionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDiscussionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
