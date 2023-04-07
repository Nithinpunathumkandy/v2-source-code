import { TestBed } from '@angular/core/testing';

import { NonConformityDashboardService } from './non-conformity-dashboard.service';

describe('NonConformityDashboardService', () => {
  let service: NonConformityDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonConformityDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
