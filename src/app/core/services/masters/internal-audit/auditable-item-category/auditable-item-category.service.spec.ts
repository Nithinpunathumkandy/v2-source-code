import { TestBed } from '@angular/core/testing';

import { AuditableItemCategoryService } from './auditable-item-category.service';

describe('AuditableItemCategoryService', () => {
  let service: AuditableItemCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditableItemCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
