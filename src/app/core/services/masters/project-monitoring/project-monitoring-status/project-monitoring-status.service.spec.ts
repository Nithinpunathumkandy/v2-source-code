import { TestBed } from '@angular/core/testing';

import { ProjectMonitoringStatusService } from './project-monitoring-status.service';

describe('ProjectMonitoringStatusService', () => {
  let service: ProjectMonitoringStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMonitoringStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
