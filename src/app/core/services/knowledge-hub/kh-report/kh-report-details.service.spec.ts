import { TestBed } from '@angular/core/testing';

import { KhReportDetailsService } from './kh-report-details.service';

describe('KhReportDetailsService', () => {
  let service: KhReportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KhReportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
