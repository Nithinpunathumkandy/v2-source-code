import { TestBed } from '@angular/core/testing';

import { ComplianceRegisterWorkflowService } from './compliance-register-workflow.service';

describe('ComplianceRegisterWorkflowService', () => {
  let service: ComplianceRegisterWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceRegisterWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
