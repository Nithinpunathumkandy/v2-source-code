import { TestBed } from '@angular/core/testing';

import { TrainingCategoryService } from './training-category.service';

describe('TrainingCategoryService', () => {
  let service: TrainingCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
