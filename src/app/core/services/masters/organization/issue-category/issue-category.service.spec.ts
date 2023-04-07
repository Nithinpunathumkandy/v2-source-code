import { TestBed } from '@angular/core/testing';

import { IssueCategoryService } from './issue-category.service';

describe('IssueCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueCategoryService = TestBed.get(IssueCategoryService);
    expect(service).toBeTruthy();
  });
});
