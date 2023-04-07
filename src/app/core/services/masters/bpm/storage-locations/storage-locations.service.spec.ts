import { TestBed } from '@angular/core/testing';

import { StorageLocationsService } from './storage-locations.service';

describe('StorageLocationsService', () => {
  let service: StorageLocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageLocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
