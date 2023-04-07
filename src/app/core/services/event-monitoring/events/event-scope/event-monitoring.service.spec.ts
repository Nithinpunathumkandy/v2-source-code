import { TestBed } from '@angular/core/testing';

import { EventMonitoringService } from './event-monitoring.service';

describe('EventMonitoringService', () => {
  let service: EventMonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMonitoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
