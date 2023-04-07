import { TestBed } from '@angular/core/testing';

import { IncidentDshboardService } from './incident-dshboard.service';

describe('IncidentDshboardService', () => {
  let service: IncidentDshboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentDshboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
