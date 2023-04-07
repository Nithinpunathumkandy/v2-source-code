import { TestBed } from '@angular/core/testing';

import { MockDrillReportService } from './mock-drill-report.service';

describe('MockDrillReportService', () => {
  let service: MockDrillReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
