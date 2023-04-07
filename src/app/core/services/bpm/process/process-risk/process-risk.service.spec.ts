import { TestBed } from '@angular/core/testing';

import { ProcessRiskService } from './process-risk.service';

describe('ProcessRiskService', () => {
  let service: ProcessRiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessRiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
