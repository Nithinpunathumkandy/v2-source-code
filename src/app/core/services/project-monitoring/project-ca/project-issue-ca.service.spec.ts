import { TestBed } from '@angular/core/testing';

import { ProjectIssueCaService } from './project-issue-ca.service';

describe('ProjectIssueCaService', () => {
  let service: ProjectIssueCaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectIssueCaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
