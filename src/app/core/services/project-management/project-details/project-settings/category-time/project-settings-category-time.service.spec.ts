import { TestBed } from '@angular/core/testing';

import { ProjectSettingsCategoryTimeService } from './project-settings-category-time.service';

describe('ProjectSettingsCategoryTimeService', () => {
  let service: ProjectSettingsCategoryTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSettingsCategoryTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
