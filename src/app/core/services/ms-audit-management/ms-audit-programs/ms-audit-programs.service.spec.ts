import { TestBed } from '@angular/core/testing';

import { MsAuditProgramsService } from './ms-audit-programs.service';

describe('MsAuditProgramsService', () => {
  let service: MsAuditProgramsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditProgramsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
