import { TestBed } from '@angular/core/testing';

import { OrganizationCustomersService } from './organization-customers.service';

describe('OrganizationCustomersService', () => {
  let service: OrganizationCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
