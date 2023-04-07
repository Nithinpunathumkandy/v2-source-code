import { TestBed } from '@angular/core/testing';

import { ByLeaderChartService } from './by-leader-chart.service';

describe('ByLeaderChartService', () => {
  let service: ByLeaderChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByLeaderChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
