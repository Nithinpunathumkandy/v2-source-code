import { TestBed } from '@angular/core/testing';

import { OrganizationfileService } from './organizationfile.service';

describe('OrganizationfileService', () => {
  let service: OrganizationfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
