import { TestBed } from '@angular/core/testing';

import { ComplianceSectionService } from './compliance-section.service';

describe('ComplianceSectionService', () => {
  let service: ComplianceSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
