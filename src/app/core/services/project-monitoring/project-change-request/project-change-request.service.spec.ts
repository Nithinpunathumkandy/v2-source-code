import { TestBed } from '@angular/core/testing';

import { ProjectChangeRequestService } from './project-change-request.service';

describe('ProjectChangeRequestService', () => {
  let service: ProjectChangeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectChangeRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
