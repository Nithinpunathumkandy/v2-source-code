import { TestBed } from '@angular/core/testing';

import { DocumentSubSubCategoriesService } from './document-sub-sub-categories.service';

describe('DocumentSubSubCategoriesService', () => {
  let service: DocumentSubSubCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentSubSubCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
