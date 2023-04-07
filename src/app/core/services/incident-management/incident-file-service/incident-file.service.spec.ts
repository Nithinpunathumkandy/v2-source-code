import { TestBed } from '@angular/core/testing';

import { IncidentFileService } from './incident-file.service';

describe('IncidentFileService', () => {
  let service: IncidentFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
