import { TestBed } from '@angular/core/testing';

import { OrganizationOverviewService } from './organization-overview.service';

describe('OrganizationOverviewService', () => {
  let service: OrganizationOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
