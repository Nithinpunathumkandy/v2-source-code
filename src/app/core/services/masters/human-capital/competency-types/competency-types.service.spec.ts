import { TestBed } from '@angular/core/testing';

import { CompetencyTypesService } from './competency-types.service';

describe('CompetencyTypesService', () => {
  let service: CompetencyTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetencyTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
