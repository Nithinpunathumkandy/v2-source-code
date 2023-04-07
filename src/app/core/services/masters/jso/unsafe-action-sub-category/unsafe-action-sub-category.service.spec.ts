import { TestBed } from '@angular/core/testing';

import { UnsafeActionSubCategoryService } from './unsafe-action-sub-category.service';

describe('UnsafeActionSubCategoryService', () => {
  let service: UnsafeActionSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsafeActionSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
