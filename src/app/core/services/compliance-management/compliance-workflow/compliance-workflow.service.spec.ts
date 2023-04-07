import { TestBed } from '@angular/core/testing';

import { ComplianceWorkflowService } from './compliance-workflow.service';

describe('ComplianceWorkflowService', () => {
  let service: ComplianceWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
