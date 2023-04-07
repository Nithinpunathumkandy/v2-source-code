import { TestBed } from '@angular/core/testing';

import { IncidentReportService } from './incident-report.service';

describe('IncidentReportService', () => {
  let service: IncidentReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
