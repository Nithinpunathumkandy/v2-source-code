import { TestBed } from '@angular/core/testing';

import { MockDrillResponseServiceService } from './mock-drill-response-service.service';

describe('MockDrillResponseServiceService', () => {
  let service: MockDrillResponseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillResponseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
