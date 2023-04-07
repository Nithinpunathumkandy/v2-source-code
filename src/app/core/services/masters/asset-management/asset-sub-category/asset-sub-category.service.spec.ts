import { TestBed } from '@angular/core/testing';

import { AssetSubCategoryService } from './asset-sub-category.service';

describe('AssetSubCategoryService', () => {
  let service: AssetSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
