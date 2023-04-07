import { TestBed } from '@angular/core/testing';

import { EaDashboardService } from './ea-dashboard.service';

describe('EaDashboardService', () => {
  let service: EaDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EaDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
