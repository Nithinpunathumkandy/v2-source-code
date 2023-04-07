import { TestBed } from '@angular/core/testing';

import { JsoReportDetailsService } from './jso-report-details.service';

describe('JsoReportDetailsService', () => {
  let service: JsoReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsoReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
