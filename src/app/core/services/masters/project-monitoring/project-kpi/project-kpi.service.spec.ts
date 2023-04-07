import { TestBed } from '@angular/core/testing';

import { ProjectKpiService } from './project-kpi.service';

describe('ProjectKpiService', () => {
  let service: ProjectKpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectKpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
