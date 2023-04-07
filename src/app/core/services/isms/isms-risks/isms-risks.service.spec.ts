import { TestBed } from '@angular/core/testing';

import { IsmsRisksService } from './isms-risks.service';

describe('IsmsRisksService', () => {
  let service: IsmsRisksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsmsRisksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
