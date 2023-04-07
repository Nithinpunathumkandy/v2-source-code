import { TestBed } from '@angular/core/testing';

import { IncidentDamageTypeService } from './incident-damage-type.service';

describe('IncidentDamageTypeService', () => {
  let service: IncidentDamageTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentDamageTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
