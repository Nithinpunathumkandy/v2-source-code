import { TestBed } from '@angular/core/testing';

import { ProfileReportService } from './profile-report.service';

describe('ProfileReportService', () => {
  let service: ProfileReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
