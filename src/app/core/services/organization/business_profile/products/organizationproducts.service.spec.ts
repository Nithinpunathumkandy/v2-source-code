import { TestBed } from '@angular/core/testing';

import { OrganizationproductsService } from './organizationproducts.service';

describe('OrganizationproductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganizationproductsService = TestBed.get(OrganizationproductsService);
    expect(service).toBeTruthy();
  });
});
