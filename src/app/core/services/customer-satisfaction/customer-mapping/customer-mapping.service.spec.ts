import { TestBed } from '@angular/core/testing';

import { CustomerMappingService } from './customer-mapping.service';

describe('CustomerMappingService', () => {
  let service: CustomerMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
