import { TestBed } from '@angular/core/testing';

import { BiaMatrixService } from './bia-matrix.service';

describe('BiaMatrixService', () => {
  let service: BiaMatrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaMatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
