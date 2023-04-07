import { TestBed } from '@angular/core/testing';

import { BpmProcessMappingService } from './bpm-process-mapping.service';

describe('BpmProcessMappingService', () => {
  let service: BpmProcessMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmProcessMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
