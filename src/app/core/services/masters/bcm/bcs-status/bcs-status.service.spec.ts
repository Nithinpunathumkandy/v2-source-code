import { TestBed } from '@angular/core/testing';

import { BcsStatusService } from './bcs-status.service';

describe('BcsStatusService', () => {
  let service: BcsStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcsStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
