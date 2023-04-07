import { TestBed } from '@angular/core/testing';

import { ProjectChangeRequestStatusService } from './project-change-request-status.service';

describe('ProjectChangeRequestStatusService', () => {
  let service: ProjectChangeRequestStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectChangeRequestStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
