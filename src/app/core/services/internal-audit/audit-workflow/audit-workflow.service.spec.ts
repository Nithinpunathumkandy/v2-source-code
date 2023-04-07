import { TestBed } from '@angular/core/testing';

import { AuditWorkflowService } from './audit-workflow.service';

describe('AuditWorkflowService', () => {
  let service: AuditWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
