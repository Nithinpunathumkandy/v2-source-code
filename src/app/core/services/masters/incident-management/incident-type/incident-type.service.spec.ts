import { TestBed } from '@angular/core/testing';

import { IncidentTypeService } from './incident-type.service';

describe('IncidentTypeService', () => {
  let service: IncidentTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
