import { TestBed } from '@angular/core/testing';

import { AuditableItemTypeService } from './auditable-item-type.service';

describe('AuditableItemTypeService', () => {
  let service: AuditableItemTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditableItemTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
