import { TestBed } from '@angular/core/testing';

import { AuditPlanCommentService } from './audit-plan-comment.service';

describe('AuditPlanCommentService', () => {
  let service: AuditPlanCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPlanCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
