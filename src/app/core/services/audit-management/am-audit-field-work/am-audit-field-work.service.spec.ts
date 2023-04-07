import { TestBed } from '@angular/core/testing';

import { AmAuditFieldWorkService } from './am-audit-field-work.service';

describe('AmAuditFieldWorkService', () => {
  let service: AmAuditFieldWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmAuditFieldWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
