import { TestBed } from '@angular/core/testing';

import { MaturityMatrixService } from './maturity-matrix.service';

describe('MaturityMatrixService', () => {
  let service: MaturityMatrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaturityMatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
