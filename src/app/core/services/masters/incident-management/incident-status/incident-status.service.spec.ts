import { TestBed } from '@angular/core/testing';

import { IncidentStatusService } from './incident-status.service';

describe('IncidentStatusService', () => {
  let service: IncidentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
