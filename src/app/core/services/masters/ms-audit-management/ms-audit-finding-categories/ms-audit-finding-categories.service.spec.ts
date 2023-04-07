import { TestBed } from '@angular/core/testing';

import { MsAuditFindingCategoriesService } from './ms-audit-finding-categories.service';

describe('MsAuditFindingCategoriesService', () => {
  let service: MsAuditFindingCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditFindingCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
