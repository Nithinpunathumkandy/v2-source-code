import { TestBed } from '@angular/core/testing';

import { MsAuditCategoryService } from './ms-audit-category.service';

describe('MsAuditCategoryService', () => {
  let service: MsAuditCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
