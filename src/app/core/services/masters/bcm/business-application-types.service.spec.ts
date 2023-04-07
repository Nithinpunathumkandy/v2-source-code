import { TestBed } from '@angular/core/testing';

import { BusinessApplicationTypesService } from './business-application-types.service';

describe('BusinessApplicationTypesService', () => {
  let service: BusinessApplicationTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessApplicationTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
