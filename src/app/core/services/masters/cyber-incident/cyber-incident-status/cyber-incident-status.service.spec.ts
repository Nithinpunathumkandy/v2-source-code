import { TestBed } from '@angular/core/testing';

import { CyberIncidentStatusService } from './cyber-incident-status.service';

describe('CyberIncidentStatusService', () => {
  let service: CyberIncidentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
