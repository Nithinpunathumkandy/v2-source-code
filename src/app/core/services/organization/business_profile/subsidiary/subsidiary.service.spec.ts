import { TestBed } from '@angular/core/testing';

import { SubsidiaryService } from './subsidiary.service';

describe('SubsidiaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubsidiaryService = TestBed.get(SubsidiaryService);
    expect(service).toBeTruthy();
  });
});
