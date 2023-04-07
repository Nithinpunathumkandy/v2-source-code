import { TestBed } from '@angular/core/testing';

import { JsoSubCategoryService } from './jso-sub-category.service';

describe('JsoSubCategoryService', () => {
  let service: JsoSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsoSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
