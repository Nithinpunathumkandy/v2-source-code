import { TestBed } from '@angular/core/testing';

import { CyberIncidentDashboardService } from './cyber-incident-dashboard.service';

describe('CyberIncidentDashboardService', () => {
  let service: CyberIncidentDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
