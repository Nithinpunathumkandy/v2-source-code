import { TestBed } from '@angular/core/testing';

import { MockDrillActionStatusService } from './mock-drill-action-status.service';

describe('MockDrillActionStatusService', () => {
  let service: MockDrillActionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillActionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
