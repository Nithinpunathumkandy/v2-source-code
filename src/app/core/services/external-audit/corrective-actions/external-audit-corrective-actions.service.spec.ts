import { TestBed } from '@angular/core/testing';

import { ExternalAuditCorrectiveActionsService } from './external-audit-corrective-actions.service';

describe('ExternalAuditCorrectiveActionsService', () => {
  let service: ExternalAuditCorrectiveActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalAuditCorrectiveActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
