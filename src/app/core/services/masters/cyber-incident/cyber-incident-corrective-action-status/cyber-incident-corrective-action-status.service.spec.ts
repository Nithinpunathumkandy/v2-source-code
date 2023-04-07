import { TestBed } from '@angular/core/testing';

import { CyberIncidentCorrectiveActionStatusService } from './cyber-incident-corrective-action-status.service';

describe('CyberIncidentCorrectiveActionStatusService', () => {
  let service: CyberIncidentCorrectiveActionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentCorrectiveActionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
