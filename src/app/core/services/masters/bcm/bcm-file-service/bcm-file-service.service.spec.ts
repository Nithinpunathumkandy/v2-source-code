import { TestBed } from '@angular/core/testing';

import { BcmFileServiceService } from './bcm-file-service.service';

describe('BcmFileServiceService', () => {
  let service: BcmFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
