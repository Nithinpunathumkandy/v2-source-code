import { TestBed } from '@angular/core/testing';

import { IncidentSubCategoryService } from './incident-sub-category.service';

describe('IncidentSubCategoryService', () => {
  let service: IncidentSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
