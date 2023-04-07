import { TestBed } from '@angular/core/testing';

import { SlaCategoryService } from './sla-category.service';

describe('SlaCategoryService', () => {
  let service: SlaCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
