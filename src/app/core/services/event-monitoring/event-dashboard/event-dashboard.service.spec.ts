import { TestBed } from '@angular/core/testing';

import { EventDashboardService } from './event-dashboard.service';

describe('EventDashboardService', () => {
  let service: EventDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
