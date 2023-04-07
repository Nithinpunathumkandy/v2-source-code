import { TestBed } from '@angular/core/testing';

import { ProjectRiskService } from './project-risk.service';

describe('ProjectRiskService', () => {
  let service: ProjectRiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectRiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
