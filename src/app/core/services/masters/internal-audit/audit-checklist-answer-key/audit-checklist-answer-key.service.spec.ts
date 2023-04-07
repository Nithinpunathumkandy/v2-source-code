import { TestBed } from '@angular/core/testing';

import { AuditChecklistAnswerKeyService } from './audit-checklist-answer-key.service';

describe('AuditChecklistAnswerKeyService', () => {
  let service: AuditChecklistAnswerKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditChecklistAnswerKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
