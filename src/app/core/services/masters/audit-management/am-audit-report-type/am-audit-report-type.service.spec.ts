import { TestBed } from '@angular/core/testing';

import { AmAuditReportTypeService } from './am-audit-report-type.service';

describe('AmAuditReportTypeService', () => {
  let service: AmAuditReportTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditReportTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
