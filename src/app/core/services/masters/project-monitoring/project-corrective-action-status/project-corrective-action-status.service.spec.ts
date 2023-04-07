import { TestBed } from '@angular/core/testing';

import { ProjectCorrectiveActionStatusService } from './project-corrective-action-status.service';

describe('ProjectCorrectiveActionStatusService', () => {
  let service: ProjectCorrectiveActionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCorrectiveActionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
