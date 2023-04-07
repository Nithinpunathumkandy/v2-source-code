import { TestBed } from '@angular/core/testing';

import { RiskCategoryService } from './risk-category.service';

describe('RiskCategoryService', () => {
  let service: RiskCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
