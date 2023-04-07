import { TestBed } from '@angular/core/testing';

import { BcpChangeRequestTypesService } from './bcp-change-request-types.service';

describe('BcpChangeRequestTypesService', () => {
  let service: BcpChangeRequestTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcpChangeRequestTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
