import { TestBed } from '@angular/core/testing';

import { CustomerCompliantTypeService } from './customer-compliant-type.service';

describe('CustomerCompliantTypeService', () => {
  let service: CustomerCompliantTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerCompliantTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
