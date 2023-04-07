import { TestBed } from '@angular/core/testing';

import { IndustryCategoryService } from './industry-category.service';

describe('IndustryCategoryService', () => {
  let service: IndustryCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndustryCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
