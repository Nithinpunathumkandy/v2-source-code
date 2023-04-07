import { TestBed } from '@angular/core/testing';

import { KpiScoreService } from './kpi-score.service';

describe('KpiScoreService', () => {
  let service: KpiScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
