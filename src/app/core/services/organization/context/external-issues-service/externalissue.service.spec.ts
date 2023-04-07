import { TestBed } from '@angular/core/testing';

import { ExternalissueService } from './externalissue.service';

describe('ExternalissueService', () => {
  let service: ExternalissueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalissueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
