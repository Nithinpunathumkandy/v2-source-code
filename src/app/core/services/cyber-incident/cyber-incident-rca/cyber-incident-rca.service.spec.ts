import { TestBed } from '@angular/core/testing';

import { CyberIncidentRcaService } from './cyber-incident-rca.service';

describe('CyberIncidentRcaService', () => {
  let service: CyberIncidentRcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentRcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
