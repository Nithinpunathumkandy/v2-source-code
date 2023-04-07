import { TestBed } from '@angular/core/testing';

import { CyberIncidentIaService } from './cyber-incident-ia.service';

describe('CyberIncidentIaService', () => {
  let service: CyberIncidentIaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentIaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
