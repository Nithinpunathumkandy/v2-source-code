import { TestBed } from '@angular/core/testing';

import { OrganizationModulesService } from './organization-modules.service';

describe('OrganizationModulesService', () => {
  let service: OrganizationModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
