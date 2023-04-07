import { TestBed } from '@angular/core/testing';

import { UnsafeActionCategoryService } from './unsafe-action-category.service';

describe('UnsafeActionCategoryService', () => {
  let service: UnsafeActionCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsafeActionCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
