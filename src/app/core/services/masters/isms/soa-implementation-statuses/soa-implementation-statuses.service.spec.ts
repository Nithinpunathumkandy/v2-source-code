import { TestBed } from '@angular/core/testing';

import { SoaImplementationStatusesService } from './soa-implementation-statuses.service';

describe('SoaImplementationStatusesService', () => {
  let service: SoaImplementationStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoaImplementationStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
