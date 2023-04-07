import { TestBed } from '@angular/core/testing';

import { MockDrillProgramStatusService } from './mock-drill-program-status.service';

describe('MockDrillProgramStatusService', () => {
  let service: MockDrillProgramStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillProgramStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
