import { TestBed } from '@angular/core/testing';

import { AmAuditControlSelfAssessmentStatusService } from './am-audit-control-self-assessment-status.service';

describe('AmAuditControlSelfAssessmentStatusService', () => {
  let service: AmAuditControlSelfAssessmentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditControlSelfAssessmentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
