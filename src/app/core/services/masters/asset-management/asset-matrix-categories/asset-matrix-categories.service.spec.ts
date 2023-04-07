import { TestBed } from '@angular/core/testing';

import { AssetMatrixCategoriesService } from './asset-matrix-categories.service';

describe('AssetMatrixCategoriesService', () => {
  let service: AssetMatrixCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetMatrixCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
