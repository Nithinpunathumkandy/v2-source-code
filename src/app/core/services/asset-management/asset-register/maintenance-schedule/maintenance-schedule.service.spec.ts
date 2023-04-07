import { TestBed } from '@angular/core/testing';

import { MaintenanceScheduleService } from './maintenance-schedule.service';

describe('MaintenanceScheduleService', () => {
  let service: MaintenanceScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
