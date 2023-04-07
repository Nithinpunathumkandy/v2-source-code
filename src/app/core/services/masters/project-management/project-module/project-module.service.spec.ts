import { TestBed } from '@angular/core/testing';

import { ProjectModuleService } from './project-module.service';

describe('ProjectModuleService', () => {
  let service: ProjectModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
