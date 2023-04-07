import { TestBed } from '@angular/core/testing';

import { RiskLibraryService } from './risk-library.service';

describe('RiskLibraryService', () => {
  let service: RiskLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
