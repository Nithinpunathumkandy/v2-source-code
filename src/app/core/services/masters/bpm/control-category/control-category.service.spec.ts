import { TestBed } from '@angular/core/testing';

import { ControlCategoryService } from './control-category.service';

describe('ControlCategoryService', () => {
  let service: ControlCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
