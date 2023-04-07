import { TestBed } from '@angular/core/testing';

import { RootCauseSubCategoriesService } from './root-cause-sub-categories.service';

describe('RootCauseSubCategoriesService', () => {
  let service: RootCauseSubCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootCauseSubCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
