import { TestBed } from '@angular/core/testing';

import { ProcessCategoriesService } from './process-categories.service';

describe('ProcessCategoriesService', () => {
  let service: ProcessCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
