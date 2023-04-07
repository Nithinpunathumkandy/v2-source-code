import { TestBed } from '@angular/core/testing';

import { DesignationZoneService } from './designation-zone.service';

describe('DesignationZoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesignationZoneService = TestBed.get(DesignationZoneService);
    expect(service).toBeTruthy();
  });
});
