import { TestBed } from '@angular/core/testing';

import { ProjectMonitoringService } from './project-monitoring.service';

describe('ProjectMonitoringService', () => {
  let service: ProjectMonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMonitoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
