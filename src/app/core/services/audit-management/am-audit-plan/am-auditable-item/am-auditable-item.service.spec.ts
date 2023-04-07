import { TestBed } from '@angular/core/testing';

import { AmAuditableItemService } from './am-auditable-item.service';

describe('AmAuditableItemService', () => {
  let service: AmAuditableItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditableItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
