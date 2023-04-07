import { TestBed } from '@angular/core/testing';

import { KpiScoreStatusesService } from './kpi-score-statuses.service';

describe('KpiScoreStatusesService', () => {
  let service: KpiScoreStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiScoreStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
