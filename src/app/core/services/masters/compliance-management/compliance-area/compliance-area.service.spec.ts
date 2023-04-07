import { TestBed } from '@angular/core/testing';

import { ComplianceAreaService } from './compliance-area.service';

describe('ComplianceAreaService', () => {
  let service: ComplianceAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
