import { TestBed } from '@angular/core/testing';

import { ControlSubcategoryService } from './control-subcategory.service';

describe('ControlSubcategoryService', () => {
  let service: ControlSubcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlSubcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
