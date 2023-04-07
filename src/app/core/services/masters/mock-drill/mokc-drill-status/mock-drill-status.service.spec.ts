import { TestBed } from '@angular/core/testing';

import { MockDrillStatusService } from './mock-drill-status.service';

describe('MockDrillStatusService', () => {
  let service: MockDrillStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
