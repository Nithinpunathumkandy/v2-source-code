import { TestBed } from '@angular/core/testing';

import { RiskSubCategoryService } from './risk-sub-category.service';

describe('RiskSubCategoryService', () => {
  let service: RiskSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
