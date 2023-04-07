import { TestBed } from '@angular/core/testing';

import { ProjectThemeService } from './project-theme.service';

describe('ProjectThemeService', () => {
  let service: ProjectThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
