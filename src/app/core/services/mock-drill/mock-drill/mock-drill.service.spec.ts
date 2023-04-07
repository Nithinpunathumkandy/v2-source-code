import { TestBed } from '@angular/core/testing';

import { MockDrillService } from './mock-drill.service';

describe('MockDrillService', () => {
  let service: MockDrillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
