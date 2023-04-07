import { TestBed } from '@angular/core/testing';

import { IncidentRootCauseService } from './incident-root-cause.service';

describe('IncidentRootCauseService', () => {
  let service: IncidentRootCauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentRootCauseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
