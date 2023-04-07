import { TestBed } from '@angular/core/testing';

import { BusinessServicesService } from './business-services.service';

describe('BusinessServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessServicesService = TestBed.get(BusinessServicesService);
    expect(service).toBeTruthy();
  });
});
