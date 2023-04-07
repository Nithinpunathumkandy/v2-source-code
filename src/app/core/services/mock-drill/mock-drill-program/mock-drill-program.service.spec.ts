import { TestBed } from '@angular/core/testing';

import { MockDrillProgramService } from './mock-drill-program.service';

describe('MockDrillProgramService', () => {
  let service: MockDrillProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
