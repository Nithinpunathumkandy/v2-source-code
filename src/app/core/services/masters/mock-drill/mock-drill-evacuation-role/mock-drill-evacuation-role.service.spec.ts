import { TestBed } from '@angular/core/testing';

import { MockDrillEvacuationRoleService } from './mock-drill-evacuation-role.service';

describe('MockDrillEvacuationRoleService', () => {
  let service: MockDrillEvacuationRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDrillEvacuationRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
