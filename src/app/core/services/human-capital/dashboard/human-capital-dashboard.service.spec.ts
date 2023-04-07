import { TestBed } from '@angular/core/testing';

import { HumanCapitalDashboardService } from './human-capital-dashboard.service';

describe('HumanCapitalDashboardService', () => {
  let service: HumanCapitalDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumanCapitalDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
