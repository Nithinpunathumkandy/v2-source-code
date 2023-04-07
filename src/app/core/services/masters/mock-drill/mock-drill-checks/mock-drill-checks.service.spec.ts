import { TestBed } from '@angular/core/testing';

import { MockDrillChecksService } from './mock-drill-checks.service';

describe('MockDrillChecksService', () => {
  let service: MockDrillChecksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillChecksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
