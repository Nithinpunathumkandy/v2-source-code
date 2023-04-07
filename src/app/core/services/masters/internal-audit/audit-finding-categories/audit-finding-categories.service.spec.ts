import { TestBed } from '@angular/core/testing';

import { AuditFindingCategoriesService } from './audit-finding-categories.service';

describe('AuditFindingCategoriesService', () => {
  let service: AuditFindingCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditFindingCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
