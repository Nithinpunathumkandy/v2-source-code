import { TestBed } from '@angular/core/testing';

import { CyberIncidentCorrectiveActionService } from './cyber-incident-corrective-action.service';

describe('CyberIncidentCorrectiveActionService', () => {
  let service: CyberIncidentCorrectiveActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentCorrectiveActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
