import { TestBed } from '@angular/core/testing';

import { KpiCategoryService } from './kpi-category.service';

describe('KpiCategoryService', () => {
  let service: KpiCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
