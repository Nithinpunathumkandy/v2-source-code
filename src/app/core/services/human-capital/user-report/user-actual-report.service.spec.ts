import { TestBed } from '@angular/core/testing';

import { UserActualReportService } from './user-actual-report.service';

describe('UserActualReportService', () => {
  let service: UserActualReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActualReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
