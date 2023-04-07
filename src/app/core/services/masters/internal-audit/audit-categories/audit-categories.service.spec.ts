import { TestBed } from '@angular/core/testing';

import { AuditCategoriesService } from './audit-categories.service';

describe('AuditCategoriesService', () => {
  let service: AuditCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
