import { TestBed } from '@angular/core/testing';

import { AmAuditCategoryService } from './am-audit-category.service';

describe('AmAuditCategoryService', () => {
  let service: AmAuditCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
