import { TestBed } from '@angular/core/testing';

import { NoConnectivityService } from './no-connectivity.service';

describe('NoConnectivityService', () => {
  let service: NoConnectivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoConnectivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
