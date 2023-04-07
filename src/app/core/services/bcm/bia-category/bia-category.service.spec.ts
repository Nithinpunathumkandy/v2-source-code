import { TestBed } from '@angular/core/testing';

import { BiaCategoryService } from './bia-category.service';

describe('BiaCategoryService', () => {
  let service: BiaCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiaCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
