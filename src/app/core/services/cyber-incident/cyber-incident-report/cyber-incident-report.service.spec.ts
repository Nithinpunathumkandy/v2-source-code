import { TestBed } from '@angular/core/testing';

import { CyberIncidentReportService } from './cyber-incident-report.service';

describe('CyberIncidentReportService', () => {
  let service: CyberIncidentReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
