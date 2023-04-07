import { TestBed } from '@angular/core/testing';

import { AuditObjectiveService } from './audit-objective.service';

describe('AuditObjectiveService', () => {
  let service: AuditObjectiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditObjectiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
