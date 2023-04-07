import { TestBed } from '@angular/core/testing';

import { MsAuditTeamService } from './ms-audit-team.service';

describe('MsAuditTeamService', () => {
  let service: MsAuditTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsAuditTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
