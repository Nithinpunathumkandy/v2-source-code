import { TestBed } from '@angular/core/testing';

import { IncidentDamageSeverityService } from './incident-damage-severity.service';

describe('IncidentDamageSeverityService', () => {
  let service: IncidentDamageSeverityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentDamageSeverityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
