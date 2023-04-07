import { TestBed } from '@angular/core/testing';

import { CompetencyMatrixService } from './competency-matrix.service';

describe('CompetencyMatrixService', () => {
  let service: CompetencyMatrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetencyMatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
