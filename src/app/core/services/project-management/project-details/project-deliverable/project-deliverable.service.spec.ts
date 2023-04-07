import { TestBed } from '@angular/core/testing';

import { ProjectDeliverableService } from './project-deliverable.service';

describe('ProjectDeliverableService', () => {
  let service: ProjectDeliverableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDeliverableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
