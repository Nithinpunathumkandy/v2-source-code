import { TestBed } from '@angular/core/testing';

import { HighAvialabilityStatusService } from './high-avialability-status.service';

describe('HighAvialabilityStatusService', () => {
  let service: HighAvialabilityStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighAvialabilityStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
