import { TestBed } from '@angular/core/testing';

import { AmAuditControlSelfAssessmentUpdateStatusService } from './am-audit-control-self-assessment-update-status.service';

describe('AmAuditControlSelfAssessmentUpdateStatusService', () => {
  let service: AmAuditControlSelfAssessmentUpdateStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditControlSelfAssessmentUpdateStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
