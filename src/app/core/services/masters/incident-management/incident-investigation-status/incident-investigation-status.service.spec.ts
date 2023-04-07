import { TestBed } from '@angular/core/testing';

import { IncidentInvestigationStatusService } from './incident-investigation-status.service';

describe('IncidentInvestigationStatusService', () => {
  let service: IncidentInvestigationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentInvestigationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
