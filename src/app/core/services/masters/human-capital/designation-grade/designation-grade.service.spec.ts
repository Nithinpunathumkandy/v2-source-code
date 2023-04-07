import { TestBed } from '@angular/core/testing';

import { DesignationGradeService } from './designation-grade.service';

describe('DesignationGradeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesignationGradeService = TestBed.get(DesignationGradeService);
    expect(service).toBeTruthy();
  });
});
