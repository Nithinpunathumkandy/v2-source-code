import { TestBed } from '@angular/core/testing';

import { IncidentMappingService } from './incident-mapping.service';

describe('IncidentMappingService', () => {
  let service: IncidentMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
