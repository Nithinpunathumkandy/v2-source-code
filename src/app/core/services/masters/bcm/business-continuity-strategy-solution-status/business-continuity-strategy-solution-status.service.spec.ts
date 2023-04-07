import { TestBed } from '@angular/core/testing';

import { BusinessContinuityStrategySolutionStatusService } from './business-continuity-strategy-solution-status.service';

describe('BusinessContinuityStrategySolutionStatusService', () => {
  let service: BusinessContinuityStrategySolutionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessContinuityStrategySolutionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
