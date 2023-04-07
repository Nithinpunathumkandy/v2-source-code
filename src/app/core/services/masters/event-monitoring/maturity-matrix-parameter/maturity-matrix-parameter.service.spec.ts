import { TestBed } from '@angular/core/testing';

import { MaturityMatrixParameterService } from './maturity-matrix-parameter.service';

describe('MaturityMatrixParameterService', () => {
  let service: MaturityMatrixParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaturityMatrixParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
