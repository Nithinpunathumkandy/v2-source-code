import { TestBed } from '@angular/core/testing';

import { MaturityMatrixRangesService } from './maturity-matrix-ranges.service';

describe('MaturityMatrixRangesService', () => {
  let service: MaturityMatrixRangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaturityMatrixRangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
