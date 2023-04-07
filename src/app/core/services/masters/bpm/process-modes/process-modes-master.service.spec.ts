import { TestBed } from '@angular/core/testing';

import { ProcessModesMasterService } from './process-modes-master.service';

describe('ProcessModesMasterService', () => {
  let service: ProcessModesMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessModesMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
