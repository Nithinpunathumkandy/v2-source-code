import { TestBed } from '@angular/core/testing';

import { AuditCriterionService } from './audit-criterion.service';

describe('AuditCriterionService', () => {
  let service: AuditCriterionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditCriterionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
