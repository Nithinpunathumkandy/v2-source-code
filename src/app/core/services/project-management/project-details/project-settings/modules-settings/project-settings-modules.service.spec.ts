import { TestBed } from '@angular/core/testing';

import { ProjectSettingsModulesService } from './project-settings-modules.service';

describe('ProjectSettingsModulesService', () => {
  let service: ProjectSettingsModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSettingsModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
