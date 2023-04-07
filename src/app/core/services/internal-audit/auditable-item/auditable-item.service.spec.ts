import { TestBed } from '@angular/core/testing';

import { AuditableItemService } from './auditable-item.service';

describe('AuditableItemService', () => {
  let service: AuditableItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditableItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
