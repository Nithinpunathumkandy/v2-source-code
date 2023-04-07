import { TestBed } from '@angular/core/testing';

import { ByAuditorService } from './by-auditor.service';

describe('ByAuditorService', () => {
  let service: ByAuditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByAuditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
