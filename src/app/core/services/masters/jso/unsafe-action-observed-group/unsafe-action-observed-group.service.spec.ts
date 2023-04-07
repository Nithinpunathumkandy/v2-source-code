import { TestBed } from '@angular/core/testing';

import { UnsafeActionObservedGroupService } from './unsafe-action-observed-group.service';

describe('UnsafeActionObservedGroupService', () => {
  let service: UnsafeActionObservedGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsafeActionObservedGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
