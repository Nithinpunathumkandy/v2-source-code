import { TestBed } from '@angular/core/testing';

import { MaturityMatrixTypesService } from './maturity-matrix-types.service';

describe('MaturityMatrixTypesService', () => {
  let service: MaturityMatrixTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaturityMatrixTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
