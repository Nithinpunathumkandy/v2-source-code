import { TestBed } from '@angular/core/testing';

import { DesignationLevelService } from './designation-level.service';

describe('DesignationLevelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesignationLevelService = TestBed.get(DesignationLevelService);
    expect(service).toBeTruthy();
  });
});
