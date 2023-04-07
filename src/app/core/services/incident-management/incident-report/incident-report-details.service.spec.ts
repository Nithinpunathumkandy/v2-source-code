import { TestBed } from '@angular/core/testing';

import { IncidentReportDetailsService } from './incident-report-details.service';

describe('IncidentReportDetailsService', () => {
  let service: IncidentReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
