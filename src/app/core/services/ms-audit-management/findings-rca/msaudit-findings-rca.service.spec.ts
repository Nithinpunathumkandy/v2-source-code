import { TestBed } from '@angular/core/testing';

import { MsauditFindingsRcaService } from './msaudit-findings-rca.service';

describe('MsauditFindingsRcaService', () => {
  let service: MsauditFindingsRcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsauditFindingsRcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
