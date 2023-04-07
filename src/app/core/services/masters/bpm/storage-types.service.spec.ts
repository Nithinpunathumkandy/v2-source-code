import { TestBed } from '@angular/core/testing';

import { StorageTypesService } from './storage-types.service';

describe('StorageTypesService', () => {
  let service: StorageTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
