import { TestBed } from '@angular/core/testing';

import { IncidentCorrectiveActionService } from './incident-corrective-action.service';

describe('IncidentCorrectiveActionService', () => {
  let service: IncidentCorrectiveActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentCorrectiveActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
