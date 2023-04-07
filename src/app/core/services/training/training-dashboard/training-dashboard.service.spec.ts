import { TestBed } from '@angular/core/testing';

import { TrainingDashboardService } from './training-dashboard.service';

describe('TrainingDashboardService', () => {
  let service: TrainingDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
