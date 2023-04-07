import { TestBed } from '@angular/core/testing';

import { CyberIncidentClassificationService } from './cyber-incident-classification.service';

describe('CyberIncidentClassificationService', () => {
  let service: CyberIncidentClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberIncidentClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
