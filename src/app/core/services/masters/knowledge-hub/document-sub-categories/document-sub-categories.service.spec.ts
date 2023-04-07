import { TestBed } from '@angular/core/testing';

import { DocumentSubCategoriesService } from './document-sub-categories.service';

describe('DocumentSubCategoriesService', () => {
  let service: DocumentSubCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentSubCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
