import { TestBed } from '@angular/core/testing';

import { MockDrillProgramMappingService } from './mock-drill-program-mapping.service';

describe('MockDrillProgramMappingService', () => {
  let service: MockDrillProgramMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillProgramMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
