import { TestBed } from '@angular/core/testing';

import { AclDashboardService } from './acl-dashboard.service';

describe('AclDashboardService', () => {
  let service: AclDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AclDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
